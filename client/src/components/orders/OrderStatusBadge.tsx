
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-500">Delivered</Badge>;
    case "shipped":
      return <Badge className="bg-blue-500">Shipped</Badge>;
    case "processing":
      return <Badge className="bg-yellow-500">Processing</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>;
    case "paid":
      return <Badge className="bg-green-500">Paid</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">Pending</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default OrderStatusBadge;
