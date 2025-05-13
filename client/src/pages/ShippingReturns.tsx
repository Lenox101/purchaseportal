
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, RefreshCcw, Truck } from "lucide-react";

const ShippingReturns = () => {
  return (
    <div className="container py-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shipping & Returns</h1>
      
      <Tabs defaultValue="shipping" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck size={16} />
            <span>Shipping Policy</span>
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex items-center gap-2">
            <RefreshCcw size={16} />
            <span>Returns Policy</span>
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Package size={16} />
            <span>Order Tracking</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="shipping" className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Shipping Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Processing Time</h3>
              <p className="text-muted-foreground">
                Orders are typically processed within 1-2 business days after payment confirmation.
                During peak seasons or promotional periods, processing may take up to 3 business days.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Shipping Methods & Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-accent/50 rounded-md">
                  <div>
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                  <p className="font-semibold">$5.99</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-accent/50 rounded-md">
                  <div>
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">1-2 business days</p>
                  </div>
                  <p className="font-semibold">$12.99</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-accent/50 rounded-md">
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over $100</p>
                  </div>
                  <p className="font-semibold">$0.00</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">International Shipping</h3>
              <p className="text-muted-foreground">
                We currently ship to the United States and Canada. International shipping rates and 
                delivery times vary by location. Customs fees, import taxes, and duties are not included 
                in the item price or shipping cost. These charges are the buyer's responsibility.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Shipping Restrictions</h3>
              <p className="text-muted-foreground">
                Some items may be restricted from shipping to certain locations due to size, weight, 
                or local regulations. You will be notified during checkout if any items in your cart 
                have shipping restrictions.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="returns" className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Returns Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Return Window</h3>
              <p className="text-muted-foreground">
                You have 30 days from the date of delivery to return an item for a full refund. 
                Items must be unused, in their original packaging, and in the same condition as 
                when you received them.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">How to Initiate a Return</h3>
              <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                <li>Log in to your account and go to your order history</li>
                <li>Select the order containing the item(s) you wish to return</li>
                <li>Click on "Return Items" and follow the instructions</li>
                <li>Print the provided return shipping label</li>
                <li>Pack the item(s) securely with all original packaging and accessories</li>
                <li>Attach the return shipping label to the outside of the package</li>
                <li>Drop off the package at the designated shipping carrier</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Refund Process</h3>
              <p className="text-muted-foreground">
                Once we receive and inspect the returned item(s), we'll send you an email to notify you 
                that we've received your return. We'll also notify you of the approval or rejection of 
                your refund. If approved, your refund will be processed, and a credit will automatically 
                be applied to your original method of payment within 5-7 business days.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Non-Returnable Items</h3>
              <p className="text-muted-foreground">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4">
                <li>Gift cards</li>
                <li>Personalized or custom-made items</li>
                <li>Downloadable products</li>
                <li>Items on sale or clearance</li>
                <li>Items marked as final sale</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Exchange Policy</h3>
              <p className="text-muted-foreground">
                We don't offer direct exchanges. If you need a different size, color, or item, 
                please return the original purchase for a refund and place a new order for the 
                desired item.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tracking" className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Order Tracking</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Track Your Order</h3>
              <p className="text-muted-foreground mb-4">
                After your order has been shipped, you can track its progress using the following methods:
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    You'll receive an email with tracking information once your order ships. 
                    Click the tracking number in the email to view the delivery status.
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium">Account Order History</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Log in to your account, navigate to your order history, and select the 
                    specific order to view its tracking details.
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <h4 className="font-medium">Carrier Websites</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use your tracking number directly on the carrier's website (USPS, FedEx, UPS, etc.) 
                    to get the most up-to-date information about your package.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Delivery Timeframes</h3>
              <p className="text-muted-foreground">
                Please note that delivery timeframes are estimates and may vary based on your location, 
                weather conditions, and other external factors. During holiday seasons and peak periods, 
                deliveries may take longer than usual.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Missing or Delayed Packages</h3>
              <p className="text-muted-foreground">
                If your tracking information hasn't updated in 48 hours or your package appears to be 
                lost or significantly delayed, please contact our customer service team for assistance.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShippingReturns;
