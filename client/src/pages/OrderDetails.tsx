
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Imported components
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderShippingInfo from "@/components/orders/OrderShippingInfo";
import OrderPaymentInfo from "@/components/orders/OrderPaymentInfo";
import OrderActions from "@/components/orders/OrderActions";
import OrderDetailsLoader from "@/components/orders/OrderDetailsLoader";
import { useOrders } from "@/hooks/useOrders";

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { orderDetails, loading, fetchOrderById } = useOrders();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
    // The fetchOrderById function is memoized with useCallback, so this is safe
  }, [id, fetchOrderById]);

  // Check if loading or order not found
  if (loading || !orderDetails) {
    return <OrderDetailsLoader loading={loading} orderExists={!!orderDetails} />;
  }

  // Render the order details when data is available
  return (
    <div className="container py-20">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/my-orders">
          <ArrowLeft size={16} className="mr-2" />
          Back to My Orders
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Order #{orderDetails.id}</CardTitle>
                <OrderStatusBadge status={orderDetails.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(orderDetails.date).toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent>
              <OrderSummary 
                items={orderDetails.items}
                subtotal={Number(orderDetails.subtotal)}
                shipping={Number(orderDetails.shipping)}
                tax={Number(orderDetails.tax)}
                total_price={Number(orderDetails.total_price)}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-2">
              <OrderActions 
                trackingNumber={orderDetails.tracking_number} 
                status={orderDetails.status}
              />
            </CardFooter>
          </Card>
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <OrderShippingInfo 
            shippingAddress={orderDetails.shipping_address} 
            trackingNumber={orderDetails.tracking_number} 
          />
          
          <OrderPaymentInfo 
            paymentMethod={orderDetails.payment_method} 
            isPaid={orderDetails.is_paid} 
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
