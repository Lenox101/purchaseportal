
import { CreditCard, ShieldCheck } from "lucide-react";
import Button from "@/components/Button";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
}

const OrderSummary = ({ 
  subtotal, 
  shipping, 
  tax, 
  total, 
  onCheckout 
}: OrderSummaryProps) => {
  return (
    <div className="rounded-lg border p-6 animate-fade-in">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        
        <div className="border-t my-3 pt-3 flex justify-between font-medium text-base">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <Button 
        className="mt-6" 
        fullWidth 
        onClick={onCheckout}
      >
        Proceed to Checkout
      </Button>
      
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <CreditCard size={16} className="mr-2" />
          <span>Secure payment processing</span>
        </div>
        
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <ShieldCheck size={16} className="mr-2" />
          <span>Protected by our policies</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
