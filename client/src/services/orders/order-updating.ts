
import { toast } from "sonner";

const API_URL = "http://localhost:4000/api";

/**
 * Updates order status (admin only)
 */
export const updateOrderStatus = async (orderId: number, status: string, token: string): Promise<void> => {
  try {
    let endpoint = `${API_URL}/orders/${orderId}/`;
    let method = "PUT";
    let body: any = {};
    
    if (status === "delivered") {
      endpoint += "deliver";
    } else if (status === "paid") {
      endpoint += "pay";
      body = {
        paymentResult: {
          id: `pay_${Date.now()}`,
          status: "succeeded",
          update_time: new Date().toISOString(),
          email_address: "customer@example.com" // This would be replaced with actual email
        }
      };
    } else {
      endpoint = `${API_URL}/orders/${orderId}`;
      body = { status };
    }
    
    // For shipped status, generate a tracking number if one doesn't exist
    if (status === "shipped") {
      body.tracking_number = generateTrackingNumber();
    }
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order to ${status}`);
    }
    
    toast.success(`Order status updated to ${status}`);
  } catch (error) {
    console.error("Error updating order status:", error);
    toast.error("Failed to update order status");
    throw error;
  }
};

// Helper function for generating tracking numbers moved to order-tracking.ts,
// but we need to re-export it here for use in this file
import { generateTrackingNumber } from './order-tracking';
