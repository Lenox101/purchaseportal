
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { 
  fetchAllOrders, 
  fetchMyOrders, 
  fetchOrderById, 
  updateOrderStatus 
} from "@/services/orders";
import { Order } from "@/utils/orderUtils";

interface OrderDetails extends Order {
  date: string;
  subtotal: number;
  shipping: number;
  tax: number;
  items: Array<{
    id: number;
    product_id: number;
    order_id: number;
    quantity: number;
    price: number;
    name: string;
    image?: string;
  }>;
}

interface UseOrdersReturn {
  orders: Order[];
  orderDetails: OrderDetails | null;
  loading: boolean;
  error: Error | null;
  fetchAllOrders: () => Promise<void>;
  fetchMyOrders: () => Promise<void>;
  fetchOrderById: (orderId: string | number) => Promise<void>;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
}

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Get user token from localStorage
  const getUserToken = (): string => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo.token || "";
  };

  // Fetch all orders (admin only)
  const fetchAllOrdersData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const token = getUserToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const data = await fetchAllOrders(token);
      setOrders(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An unknown error occurred");
      setError(err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch current user's orders
  const fetchMyOrdersData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const token = getUserToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const data = await fetchMyOrders(token);
      setOrders(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An unknown error occurred");
      setError(err);
      toast.error("Failed to load your orders");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific order by ID
  const fetchOrderByIdData = useCallback(async (orderId: string | number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const token = getUserToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const data = await fetchOrderById(orderId, token);
      setOrderDetails(data as OrderDetails);
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An unknown error occurred");
      setError(err);
      toast.error("Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an order's status (admin only)
  const updateOrderStatusData = useCallback(async (orderId: number, status: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const token = getUserToken();
      
      if (!token) {
        throw new Error("Authentication required");
      }
      
      await updateOrderStatus(orderId, status, token);
      
      // Refresh the orders list
      await fetchAllOrdersData();
      
      // If we're looking at order details, refresh those too
      if (orderDetails && orderDetails.id === orderId) {
        await fetchOrderByIdData(orderId);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error("An unknown error occurred");
      setError(err);
      // The toast is already shown in the service function
    } finally {
      setLoading(false);
    }
  }, [fetchAllOrdersData, fetchOrderByIdData, orderDetails]);

  return {
    orders,
    orderDetails,
    loading,
    error,
    fetchAllOrders: fetchAllOrdersData,
    fetchMyOrders: fetchMyOrdersData,
    fetchOrderById: fetchOrderByIdData,
    updateOrderStatus: updateOrderStatusData
  };
};
