
import { Order } from "@/utils/orderUtils";
import { isTrackingAvailable, generateTrackingNumber } from "@/utils/orderUtils";

/**
 * Transforms a list of orders from the API format to our application format
 */
export const transformOrdersData = (data: any[]): Order[] => {
  return data.map((order: any) => ({
    id: order.id,
    date: order.created_at,
    total_price: parseFloat(order.total_price) || 0,
    status: order.status,
    items: order.items ? order.items.length : 0,
    // Generate tracking number for orders that should have one if not provided
    tracking_number: order.tracking_number || 
      (isTrackingAvailable(order.status) ? generateTrackingNumber() : undefined),
    created_at: order.created_at,
    user_id: order.user_id,
    shipping_address: order.shipping_address,
    payment_method: order.payment_method,
    is_paid: order.is_paid,
    is_delivered: order.is_delivered,
    updated_at: order.updated_at,
    user_name: order.user_name,
    user_email: order.user_email
  }));
};

/**
 * Formats a single order from the API format to our application format
 */
export const formatOrderData = (data: any): Order => {
  // Ensure data.items is an array before calculating subtotal
  const items = Array.isArray(data.items) ? data.items : [];
  
  // Calculate subtotal from items
  const subtotal = items.reduce(
    (sum: number, item: any) => sum + (item.price * item.quantity), 0
  );
  
  // Assume shipping is $10 if not provided
  const shipping = data.shipping_cost || 10;
  
  // Calculate tax (or set to 0 if not provided)
  const tax = data.tax || subtotal * 0.08;

  // Parse numeric fields to ensure they're numbers
  const total = typeof data.total_price === 'number' 
    ? data.total_price 
    : parseFloat(data.total_price) || (subtotal + shipping + tax);

  // Generate tracking number for shipped/delivered orders if not provided
  const trackingNumber = data.tracking_number || 
    (isTrackingAvailable(data.status) ? generateTrackingNumber() : undefined);

  // Transform the data to match our component's expected format
  return {
    ...data,
    date: data.created_at,
    subtotal: Number(subtotal),
    shipping: Number(shipping),
    tax: Number(tax),
    total_price: Number(total),
    tracking_number: trackingNumber,
    // Add image URLs to items and ensure items is always an array
    items: items.map((item: any) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image || `http://localhost:4000/api/products/${item.product_id}/image`
    }))
  };
};
