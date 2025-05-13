
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const cardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number must be at most 19 digits")
    .regex(/^[0-9\s]+$/, "Card number must only contain numbers"),
  cardHolder: z
    .string()
    .min(3, "Cardholder name must be at least 3 characters"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Expiry date must be in MM/YY format"),
  cvv: z
    .string()
    .length(3, "CVV must be 3 digits")
    .regex(/^[0-9]+$/, "CVV must only contain numbers"),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface CreditCardFormProps {
  onPaymentComplete: () => void;
  total: number;
}

const CreditCardForm = ({ onPaymentComplete, total }: CreditCardFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { isDark } = useTheme();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleSubmit = (values: CardFormValues) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful!");
      onPaymentComplete();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, "");
    
    // Add spaces every 4 digits
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    
    return formatted.substring(0, 19); // Limit to 19 characters (16 digits + 3 spaces)
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setValue("cardNumber", formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    
    form.setValue("expiryDate", value);
  };

  return (
    <div className={`rounded-lg border p-6 animate-fade-in ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>Secure Payment</h3>
        <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`}>
          <Lock size={14} className="mr-1" />
          <span>SSL Encrypted</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="pl-10"
                    />
                    <CreditCard className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-muted-foreground'}`} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cardHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardholder Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="MM/YY" 
                      {...field} 
                      onChange={handleExpiryDateChange}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123" 
                      {...field} 
                      maxLength={3}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreditCardForm;
