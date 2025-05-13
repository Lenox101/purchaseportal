
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/utils/orderUtils";

interface OrderItem {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total_price: number;
}

const OrderSummary = ({ items, subtotal, shipping, tax, total_price }: OrderSummaryProps) => {
  return (
    <>
      <h3 className="font-medium mb-3">Items</h3>
      <ScrollArea className="h-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  {formatPrice(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="mt-6 space-y-2 border-t pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        {tax > 0 && (
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium text-lg border-t pt-2">
          <span>Total</span>
          <span>{formatPrice(total_price)}</span>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
