
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUserInfo = localStorage.getItem("userInfo");
    
    if (!storedUserInfo) {
      toast.error("You need to be logged in to view your profile");
      navigate("/auth");
      return;
    }

    const parsedUserInfo = JSON.parse(storedUserInfo);
    setUserInfo(parsedUserInfo);
    setFormData({
      name: parsedUserInfo.name || "",
      email: parsedUserInfo.email || ""
    });
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form data to current user info
    setFormData({
      name: userInfo?.name || "",
      email: userInfo?.email || ""
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validate inputs
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error("Name and email are required");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUserData = await response.json();
      
      // Update local storage with new user info
      const updatedUserInfo = {
        ...userInfo,
        name: updatedUserData.name,
        email: updatedUserData.email
      };
      
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      
      // Trigger storage event for other components to update
      window.dispatchEvent(new Event("userInfoChanged"));
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">Loading profile information...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </header>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  placeholder="Your email address"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </CardTitle>
            <CardDescription>
              Information about your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <p className="flex items-center gap-2 mt-1">
                  {userInfo?.isAdmin ? (
                    <Badge className="bg-primary">Administrator</Badge>
                  ) : (
                    <Badge variant="outline">Standard User</Badge>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Verification</p>
                <p className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    Verified
                  </Badge>
                </p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Actions</p>
              <div className="mt-2">
                <Button variant="outline" onClick={() => navigate("/settings")} className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
