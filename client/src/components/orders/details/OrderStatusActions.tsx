
import React from "react";
import { Package, Check, Truck, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order } from "@/utils/orderUtils";

interface OrderStatusActionsProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: string) => Promise<void>;
}

const OrderStatusActions: React.FC<OrderStatusActionsProps> = ({ order, onUpdateStatus }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Update Order Status</CardTitle>
        <CardDescription>Change the current status of this order</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onUpdateStatus(order.id, "processing")}
            disabled={order.status === "processing"}
          >
            <Package className="h-4 w-4" />
            Mark as Processing
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onUpdateStatus(order.id, "paid")}
            disabled={order.is_paid}
          >
            <Check className="h-4 w-4" />
            Mark as Paid
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onUpdateStatus(order.id, "shipped")}
            disabled={order.status === "shipped" || order.status === "delivered"}
          >
            <Truck className="h-4 w-4" />
            Mark as Shipped
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onUpdateStatus(order.id, "delivered")}
            disabled={order.is_delivered}
          >
            <Check className="h-4 w-4" />
            Mark as Delivered
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 text-destructive"
            onClick={() => onUpdateStatus(order.id, "cancelled")}
            disabled={order.status === "cancelled" || order.status === "delivered"}
          >
            <AlertCircle className="h-4 w-4" />
            Cancel Order
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusActions;
