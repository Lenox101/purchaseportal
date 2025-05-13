
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Order } from "@/utils/orderUtils";

interface CustomerInformationCardProps {
  order: Order;
}

const CustomerInformationCard: React.FC<CustomerInformationCardProps> = ({ order }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name:</span>
          <span>{order.user_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email:</span>
          <span>{order.user_email}</span>
        </div>
        
        <div className="pt-4">
          <h4 className="font-medium mb-2">Shipping Address</h4>
          {order.shipping_address && (
            <div className="text-sm">
              <p>{order.shipping_address.address}</p>
              <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postalCode}</p>
              <p>{order.shipping_address.country}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInformationCard;
