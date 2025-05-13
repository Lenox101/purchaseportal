
export interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface Order {
  id: number;
  user_id: number;
  shipping_address: any;
  payment_method: string;
  total_price: number | string;
  status: string;
  is_paid: boolean;
  is_delivered: boolean;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
  items?: OrderItem[];
  tracking_number?: string;
  date?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
}

// Helper function to safely format price
export const formatPrice = (price: number | string | undefined): string => {
  if (price === undefined) return '$0.00';
  
  // Convert price to number if it's a string
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Check if conversion resulted in a valid number
  if (isNaN(numericPrice)) return '$0.00';
  
  return `$${numericPrice.toFixed(2)}`;
};

// Helper function to check if tracking is available based on order status
export const isTrackingAvailable = (status: string): boolean => {
  return ['processing', 'shipped', 'delivered'].includes(status.toLowerCase());
};

// Helper function to generate a tracking number if not present
export const generateTrackingNumber = (): string => {
  const prefix = 'TRACK';
  const randomDigits = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `${prefix}${randomDigits}`;
};
