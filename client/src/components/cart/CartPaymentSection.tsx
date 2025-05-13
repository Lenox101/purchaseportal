
import OrderSummary from "./OrderSummary";
import CreditCardForm from "@/components/CreditCardForm";

interface CartPaymentSectionProps {
  isPaymentFormVisible: boolean;
  userEmail: string | null;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onCheckout: () => void;
  onPaymentComplete: () => void;
}

const CartPaymentSection = ({
  isPaymentFormVisible,
  userEmail,
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
  onPaymentComplete
}: CartPaymentSectionProps) => {
  return (
    <div>
      {isPaymentFormVisible ? (
        <>
          {userEmail && (
            <div className="mb-4 text-sm text-muted-foreground">
              Paying as: <span className="font-medium">{userEmail}</span>
            </div>
          )}
          <CreditCardForm onPaymentComplete={onPaymentComplete} total={total} />
        </>
      ) : (
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          onCheckout={onCheckout}
        />
      )}
    </div>
  );
};

export default CartPaymentSection;
