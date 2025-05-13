
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Key, 
  Shield, 
  BellRing, 
  Mail, 
  Moon, 
  Sun, 
  Smartphone,
  ShieldAlert,
  LogOut 
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { theme, setTheme } = useTheme();
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    adminMode: false
  });

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = localStorage.getItem("userInfo");
    
    if (!storedUserInfo) {
      toast.error("You need to be logged in to view settings");
      navigate("/auth");
      return;
    }

    const parsedUserInfo = JSON.parse(storedUserInfo);
    setUserInfo(parsedUserInfo);
    
    // Set admin mode from user info
    if (parsedUserInfo.adminMode !== undefined) {
      setSettings(prev => ({
        ...prev,
        adminMode: parsedUserInfo.adminMode
      }));
    }
    
    setLoading(false);
  }, [navigate]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          password: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }
      
      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminMode = () => {
    if (!userInfo.isAdmin) {
      toast.error("You don't have administrator privileges");
      return;
    }
    
    const newAdminMode = !settings.adminMode;
    
    // Update settings state
    setSettings(prev => ({
      ...prev,
      adminMode: newAdminMode
    }));
    
    // Update user info in local storage
    const updatedUserInfo = {
      ...userInfo,
      adminMode: newAdminMode
    };
    
    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
    setUserInfo(updatedUserInfo);
    
    // Trigger storage event for other components to update
    window.dispatchEvent(new Event("userInfoChanged"));
    
    toast.success(newAdminMode ? "Admin mode activated" : "Admin mode deactivated");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userInfoChanged"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast.success(`${checked ? "Dark" : "Light"} mode activated`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and security</p>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">Dark Mode</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {userInfo.isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Administrator Options</CardTitle>
                <CardDescription>
                  Options available to administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Admin Mode</span>
                      {settings.adminMode && (
                        <Badge className="bg-primary ml-2">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toggle administrator privileges
                    </p>
                  </div>
                  <Switch
                    checked={settings.adminMode}
                    onCheckedChange={toggleAdminMode}
                  />
                </div>
                
                {settings.adminMode && (
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/admin/dashboard")}
                      className="w-full"
                    >
                      Go to Admin Dashboard
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email Notifications</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive order updates and promotions via email
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm font-medium">SMS Notifications</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive order and delivery updates via SMS
                  </p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4" />
                    <span className="text-sm font-medium">Push Notifications</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={false}
                  disabled
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Save Notification Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-sm font-medium">Enable Two-Factor Authentication</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require a verification code when logging in
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>
              
              {settings.twoFactorAuth && (
                <div className="p-4 bg-accent rounded-md mt-4">
                  <p className="text-sm">
                    Two-factor authentication is enabled for your account. You'll receive a verification code when logging in from a new device.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Account Actions</CardTitle>
              <CardDescription>
                Manage your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout of Your Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
