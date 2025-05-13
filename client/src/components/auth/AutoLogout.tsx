
import { useEffect, useState } from 'react';
import { isTokenExpired, handleSessionExpired } from '@/utils/authUtils';

const AUTO_CHECK_INTERVAL = 60 * 1000; // Check every minute

const AutoLogout = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // Load user info from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
    
    // Listen for changes to userInfo
    const handleStorageChange = () => {
      const updatedUserInfo = localStorage.getItem("userInfo");
      if (updatedUserInfo) {
        try {
          setUserInfo(JSON.parse(updatedUserInfo));
        } catch (error) {
          console.error("Error parsing user info:", error);
        }
      } else {
        setUserInfo(null);
      }
    };
    
    window.addEventListener("userInfoChanged", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("userInfoChanged", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  // Set up interval to check for token expiration
  useEffect(() => {
    if (!userInfo?.token) return;
    
    // Check immediately on mount or when userInfo changes
    if (isTokenExpired()) {
      handleSessionExpired();
      return;
    }
    
    // Set up periodic checks
    const intervalId = setInterval(() => {
      if (isTokenExpired()) {
        handleSessionExpired();
        clearInterval(intervalId);
      }
    }, AUTO_CHECK_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [userInfo]);
  
  // This is a utility component with no UI
  return null;
};

export default AutoLogout;
