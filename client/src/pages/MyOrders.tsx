
import React, { useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, RefreshCcw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/utils/orderUtils";
import { useOrders } from "@/hooks/useOrders";

const MyOrders = () => {
  const { orders, loading, fetchMyOrders } = useOrders();

  useEffect(() => {
    fetchMyOrders();
    // The fetchMyOrders function is memoized with useCallback, so this is safe
  }, [fetchMyOrders]);

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="container py-20">
      <div className="flex items-center mb-8">
        <ShoppingBag className="mr-2" size={24} />
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <Package size={48} className="text-muted-foreground mb-4" />
            <p className="text-xl font-medium mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Button asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View and track all your previous orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{formatPrice(order.total_price)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{order.items ? order.items.length : 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/order-details/${order.id}`}>
                            <Eye className="mr-1" size={14} />
                            Details
                          </Link>
                        </Button>
                        {order.tracking_number && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/shipping-returns?tracking=${order.tracking_number}`}>
                              <Package className="mr-1" size={14} />
                              Track
                            </Link>
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            <RefreshCcw className="mr-1" size={14} />
                            Return
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyOrders;
