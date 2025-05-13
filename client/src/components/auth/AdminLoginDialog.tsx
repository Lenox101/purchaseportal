
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Button from "@/components/Button";
import { useTheme } from "@/contexts/ThemeContext";

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginAs: (isAdmin: boolean) => void;
}

const AdminLoginDialog = ({ open, onOpenChange, onLoginAs }: AdminLoginDialogProps) => {
  const { isDark } = useTheme();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={isDark ? "dark:bg-gray-800 dark:text-white dark:border-gray-700" : ""}>
        <DialogHeader>
          <DialogTitle>Administrator Account</DialogTitle>
          <DialogDescription className={isDark ? "dark:text-gray-300" : ""}>
            You have administrator privileges. How would you like to sign in?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onLoginAs(false)}
            fullWidth
          >
            Sign in as Regular User
          </Button>
          <Button 
            onClick={() => onLoginAs(true)}
            fullWidth
          >
            Sign in as Administrator
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginDialog;
