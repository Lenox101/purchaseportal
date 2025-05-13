
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderShippingInfoProps {
  shippingAddress: ShippingAddress | null;
  trackingNumber?: string;
}

const OrderShippingInfo = ({ shippingAddress, trackingNumber }: OrderShippingInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck size={18} className="mr-2" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {shippingAddress ? (
          <div>
            <p className="text-sm">
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
            </p>
            <p className="text-sm mb-4">{shippingAddress.country}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">No shipping information available</p>
        )}
        
        {trackingNumber ? (
          <div className="border rounded-md p-3 bg-muted/30 mt-2">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Tracking Number:</p>
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
            <p className="text-sm font-mono bg-background p-1.5 rounded border mb-3">{trackingNumber}</p>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link to={`/shipping-returns?tracking=${trackingNumber}`}>
                <Truck size={14} className="mr-1.5" />
                Track Package
              </Link>
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No tracking number available yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderShippingInfo;
