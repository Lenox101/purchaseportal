
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Package, RefreshCcw, Truck, ArrowRight } from "lucide-react";

interface OrderActionsProps {
  trackingNumber?: string;
  status: string;
}

const OrderActions = ({ trackingNumber, status }: OrderActionsProps) => {
  return (
    <>
      {trackingNumber && (
        <Button variant="outline" asChild>
          <Link to={`/shipping-returns?tracking=${trackingNumber}`}>
            <Truck size={16} className="mr-2" />
            Track Shipment
          </Link>
        </Button>
      )}
      {status === "delivered" && (
        <Button variant="outline">
          <RefreshCcw size={16} className="mr-2" />
          Return Items
        </Button>
      )}
      <Button variant="default">
        <Package size={16} className="mr-2" />
        Buy Again
        <ArrowRight size={14} className="ml-1" />
      </Button>
    </>
  );
};

export default OrderActions;
