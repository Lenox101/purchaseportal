
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderPaymentInfoProps {
  paymentMethod: string;
  isPaid: boolean;
}

const OrderPaymentInfo = ({ paymentMethod, isPaid }: OrderPaymentInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">{paymentMethod || "Credit Card"}</div>
        <div className="text-sm mt-2">
          {isPaid ? (
            <Badge variant="outline" className="bg-green-100 text-green-800">Paid</Badge>
          ) : (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderPaymentInfo;
