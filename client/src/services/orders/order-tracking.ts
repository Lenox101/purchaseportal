
import { toast } from "sonner";
import { generateTrackingNumber as createTrackingNumber } from "@/utils/orderUtils";

const API_URL = "http://localhost:4000/api";

// Re-export the tracking number generator for consistency
export const generateTrackingNumber = createTrackingNumber;

/**
 * Update order tracking number
 */
export const updateOrderTracking = async (orderId: number, trackingNumber: string, token: string): Promise<void> => {
  try {
    const endpoint = `${API_URL}/orders/${orderId}`;
    
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tracking_number: trackingNumber }),
    });

    if (!response.ok) {
      throw new Error("Failed to update tracking number");
    }
    
    toast.success("Tracking number updated successfully");
  } catch (error) {
    console.error("Error updating tracking number:", error);
    toast.error("Failed to update tracking number");
    throw error;
  }
};
