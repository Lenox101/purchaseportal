
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Create a connection pool with LOAD_FILE enabled
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Enable local_infile to use LOAD_FILE
  multipleStatements: true,
  flags: ['LOCAL_FILES']
});

// Helper function to check if a file exists and is readable
const checkFileReadable = (filePath) => {
  try {
    if (!filePath) return false;
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
};

// Test the connection and check if LOAD_FILE is enabled
pool.getConnection()
  .then(async connection => {
    console.log('Database connected successfully');
    
    try {
      // Check if file_priv is enabled
      const [result] = await connection.query(`
        SHOW VARIABLES LIKE 'secure_file_priv'
      `);
      
      if (result.length > 0) {
        const secureFilePath = result[0].Value;
        if (secureFilePath) {
          console.log(`MySQL secure_file_priv is set to: ${secureFilePath}`);
          console.log('Note: For LOAD_FILE to work, images must be in this directory or secure_file_priv must be empty');
          
          // Ensure uploads directory exists
          if (!fs.existsSync(secureFilePath)) {
            try {
              fs.mkdirSync(secureFilePath, { recursive: true });
              console.log(`Created secure file directory: ${secureFilePath}`);
            } catch (mkdirError) {
              console.warn(`Could not create secure file directory: ${mkdirError.message}`);
            }
          }
        } else {
          console.log('MySQL secure_file_priv is empty, LOAD_FILE should work with proper permissions');
        }
      }
      
      // Check if local_infile is enabled
      try {
        const [infileResult] = await connection.query(`
          SHOW VARIABLES LIKE 'local_infile'
        `);
        
        if (infileResult.length > 0) {
          const localInfileValue = infileResult[0].Value;
          console.log(`MySQL local_infile is set to: ${localInfileValue}`);
          
          if (localInfileValue.toLowerCase() === 'off') {
            console.warn('Warning: local_infile is OFF. To enable it:');
            console.warn('1. Add "local_infile=1" to your MySQL configuration file (my.ini or my.cnf)');
            console.warn('2. Restart MySQL server');
            console.warn('3. Run "SET GLOBAL local_infile = 1;" from a MySQL client with admin privileges');
          }
        }
      } catch (infileError) {
        console.warn('Could not check local_infile setting:', infileError.message);
      }
      
      // Test LOAD_FILE functionality
      try {
        const testPath = process.env.MYSQL_UPLOADS_DIR || path.join(result[0].Value, 'test.txt');
        console.log(`Testing LOAD_FILE with path: ${testPath}`);
        
        // Create a test file if it doesn't exist
        if (!checkFileReadable(testPath)) {
          try {
            fs.writeFileSync(testPath, 'This is a test file for LOAD_FILE functionality.');
            console.log(`Created test file at ${testPath}`);
          } catch (writeError) {
            console.warn(`Could not create test file: ${writeError.message}`);
          }
        }
        
        const [loadFileTest] = await connection.query(
          'SELECT LOAD_FILE(?) as result', 
          [testPath]
        );
        
        if (loadFileTest[0].result) {
          console.log('LOAD_FILE is working correctly');
        } else {
          console.warn('LOAD_FILE returned null. Ensure the file exists and MySQL has read permissions.');
          console.warn('MySQL user needs FILE privilege and the file must be readable by MySQL');
          console.warn(`Checking file at path ${testPath}: ${checkFileReadable(testPath) ? 'File is readable' : 'File is not readable or does not exist'}`);
          
          // Check FILE privilege
          try {
            const [filePrivResult] = await connection.query(`
              SELECT * FROM mysql.user 
              WHERE User = ? AND File_priv = 'Y'
            `, [process.env.DB_USER]);
            
            if (filePrivResult.length === 0) {
              console.warn(`User '${process.env.DB_USER}' does not have FILE privilege. To grant it:`);
              console.warn(`Run: GRANT FILE ON *.* TO '${process.env.DB_USER}'@'localhost';`);
              console.warn('Then: FLUSH PRIVILEGES;');
            } else {
              console.log(`User '${process.env.DB_USER}' has FILE privilege.`);
            }
          } catch (privError) {
            console.warn('Could not check FILE privilege:', privError.message);
          }
        }
      } catch (loadFileError) {
        console.warn('Error testing LOAD_FILE:', loadFileError.message);
      }
      
    } catch (error) {
      console.warn('Could not check secure_file_priv:', error.message);
    }
    
    connection.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Export helpers with the pool
module.exports = {
  pool,
  checkFileReadable,
  query: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return [results, null];
    } catch (error) {
      return [null, error];
    }
  }
};
