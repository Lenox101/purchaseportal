
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  BarChart4,
  UserCog
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    if (!userInfo.token || !userInfo.isAdmin || !userInfo.adminMode) {
      toast.error("You need admin privileges to access this page");
      navigate("/auth");
      return;
    }

    // Fetch admin dashboard stats
    fetchDashboardStats(userInfo.token);
  }, [navigate]);

  const fetchDashboardStats = async (token: string) => {
    try {
      // Fetch real stats from the backend
      const response = await fetch("http://localhost:4000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }
      
      const data = await response.json();
      setStats({
        totalUsers: data.totalUsers || 0,
        totalProducts: data.totalProducts || 0,
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      setLoading(false);
      
      // Fallback to placeholder data if there's an error
      setStats({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0
      });
      
      toast.error("Failed to load dashboard statistics");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your store's products, orders, and customers</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Access Cards */}
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" 
              onClick={() => navigate("/admin/users")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Manage Users
            </CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>
          </CardHeader>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {stats.totalUsers} registered users
            </p>
          </CardFooter>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/admin/products")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Manage Products
            </CardTitle>
            <CardDescription>Add, edit, or remove products</CardDescription>
          </CardHeader>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {stats.totalProducts} products in inventory
            </p>
          </CardFooter>
        </Card>
        
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate("/admin/orders")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Manage Orders
            </CardTitle>
            <CardDescription>View and process customer orders</CardDescription>
          </CardHeader>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {stats.totalOrders} total orders
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
