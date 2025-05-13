
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const AdminOrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case "processing":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Processing</Badge>;
    case "paid":
      return <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>;
    case "shipped":
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Shipped</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-green-500 text-white">Delivered</Badge>;
    case "cancelled":
      return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default AdminOrderStatusBadge;
