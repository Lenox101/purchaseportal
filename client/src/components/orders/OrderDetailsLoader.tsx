
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface OrderDetailsLoaderProps {
  loading: boolean;
  orderExists: boolean;
}

const OrderDetailsLoader = ({ loading, orderExists }: OrderDetailsLoaderProps) => {
  if (loading) {
    return (
      <div className="container py-20 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderExists) {
    return (
      <div className="container py-20">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="text-xl font-medium mb-2">Order not found</p>
            <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
            <Button asChild>
              <Link to="/my-orders">Back to My Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default OrderDetailsLoader;
