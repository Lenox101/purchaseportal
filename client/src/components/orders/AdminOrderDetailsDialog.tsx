
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Order } from "@/utils/orderUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import OrderInformationCard from "./details/OrderInformationCard";
import CustomerInformationCard from "./details/CustomerInformationCard";
import OrderItemsTable from "./details/OrderItemsTable";
import OrderStatusActions from "./details/OrderStatusActions";

interface AdminOrderDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrder: Order | null;
  onUpdateStatus: (orderId: number, status: string) => Promise<void>;
}

const AdminOrderDetailsDialog: React.FC<AdminOrderDetailsDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedOrder,
  onUpdateStatus
}) => {
  const isMobile = useIsMobile();
  
  if (!selectedOrder) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea 
          className={isMobile ? "max-h-[60vh] pr-4" : ""} 
          adminStyle={true}
          hideScrollbar={!isMobile}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <OrderInformationCard order={selectedOrder} />
            <CustomerInformationCard order={selectedOrder} />
            
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <OrderItemsTable items={selectedOrder.items} />
            )}
            
            <OrderStatusActions 
              order={selectedOrder} 
              onUpdateStatus={onUpdateStatus} 
            />
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOrderDetailsDialog;
