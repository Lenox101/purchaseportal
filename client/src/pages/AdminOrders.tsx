
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminOrdersTable from "@/components/orders/AdminOrdersTable";
import AdminOrderDetailsDialog from "@/components/orders/AdminOrderDetailsDialog";
import { Order } from "@/utils/orderUtils";
import { useOrders } from "@/hooks/useOrders";

const AdminOrders = () => {
  const navigate = useNavigate();
  const { 
    orders, 
    orderDetails, 
    loading, 
    fetchAllOrders, 
    fetchOrderById, 
    updateOrderStatus 
  } = useOrders();
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    
    if (!userInfo.token || !userInfo.isAdmin || !userInfo.adminMode) {
      toast.error("You need admin privileges to access this page");
      navigate("/auth");
      return;
    }

    fetchAllOrders();
    // Dependencies array ensures this only runs once on mount and when navigate or fetchAllOrders changes
  }, [fetchAllOrders, navigate]);

  // Update the selectedOrder when orderDetails changes
  useEffect(() => {
    if (orderDetails && showOrderDetails) {
      setSelectedOrder(orderDetails);
    }
  }, [orderDetails, showOrderDetails]);

  const viewOrderDetails = async (order: Order) => {
    try {
      await fetchOrderById(order.id);
      setSelectedOrder(orderDetails || order);
      setShowOrderDetails(true);
    } catch (error) {
      // Error is handled inside the hook
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status);
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="flex justify-between items-center mb-8 mt-5">
        <div>
          <h1 className="text-4xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-2">Manage and process customer orders</p>
        </div>
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <AdminOrdersTable 
        orders={filteredOrders} 
        loading={loading} 
        onViewOrder={viewOrderDetails} 
      />

      <AdminOrderDetailsDialog
        isOpen={showOrderDetails}
        onOpenChange={setShowOrderDetails}
        selectedOrder={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};

export default AdminOrders;
