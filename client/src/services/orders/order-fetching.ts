
import { Order } from "@/utils/orderUtils";
import { formatOrderData, transformOrdersData } from "./order-utils";

const API_URL = "http://localhost:4000/api";

/**
 * Fetches all orders (admin only)
 */
export const fetchAllOrders = async (token: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

/**
 * Fetches orders for the current user
 */
export const fetchMyOrders = async (token: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders/myorders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await response.json();
    
    // Transform the data to match our expected format
    return transformOrdersData(data);
  } catch (error) {
    console.error("Error fetching my orders:", error);
    throw error;
  }
};

/**
 * Fetches a single order by ID
 */
export const fetchOrderById = async (orderId: string | number, token: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    const data = await response.json();
    
    return formatOrderData(data);
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
