
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminOrderStatusBadge from "../AdminOrderStatusBadge";
import { Order, formatPrice } from "@/utils/orderUtils";

interface OrderInformationCardProps {
  order: Order;
}

const OrderInformationCard: React.FC<OrderInformationCardProps> = ({ order }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Order Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span><AdminOrderStatusBadge status={order.status} /></span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Date:</span>
          <span>{new Date(order.created_at).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-bold">{formatPrice(order.total_price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Method:</span>
          <span>{order.payment_method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Payment Status:</span>
          <span>{order.is_paid ? 'Paid' : 'Unpaid'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Delivery Status:</span>
          <span>{order.is_delivered ? 'Delivered' : 'Not Delivered'}</span>
        </div>
        {order.tracking_number && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tracking Number:</span>
            <span>{order.tracking_number}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderInformationCard;
