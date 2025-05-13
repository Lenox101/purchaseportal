
import React from "react";
import { Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminOrderStatusBadge from "./AdminOrderStatusBadge";
import { Order, formatPrice } from "@/utils/orderUtils";

interface AdminOrdersTableProps {
  orders: Order[];
  loading: boolean;
  onViewOrder: (order: Order) => void;
}

const AdminOrdersTable: React.FC<AdminOrdersTableProps> = ({ 
  orders, 
  loading, 
  onViewOrder 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>
              <div className="flex items-center">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">Loading orders...</TableCell>
            </TableRow>
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">No orders found</TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.user_name}</div>
                    <div className="text-sm text-muted-foreground">{order.user_email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()} <br />
                  <span className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </span>
                </TableCell>
                <TableCell><AdminOrderStatusBadge status={order.status} /></TableCell>
                <TableCell className="text-right">{formatPrice(order.total_price)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onViewOrder(order)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrdersTable;
