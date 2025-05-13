
import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const FAQ = () => {
  const { isDark } = useTheme();
  
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Domestic orders typically arrive within 3-5 business days. International shipping may take 7-14 business days depending on the destination country and customs processing.",
      category: "shipping"
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of delivery. Items must be in original condition with tags attached. Please visit our Returns page for more information.",
      category: "returns"
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. Shipping fees and delivery times vary by location.",
      category: "shipping"
    },
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard.",
      category: "shipping"
    },
    {
      question: "Are your products sustainable?",
      answer: "Yes, we are committed to sustainability. Our products are made with eco-friendly materials, and we use recycled packaging materials.",
      category: "products"
    },
    {
      question: "Can I change or cancel my order?",
      answer: "Orders can be modified or canceled within 2 hours of placement. Please contact our customer service team as soon as possible.",
      category: "orders"
    },
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, we offer gift wrapping for an additional fee of $5. You can select this option during checkout.",
      category: "orders"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay.",
      category: "payment"
    },
    {
      question: "How do I care for my products?",
      answer: "Care instructions are included with each product. Generally, we recommend gentle washing and avoiding harsh chemicals to preserve quality.",
      category: "products"
    },
    {
      question: "Do you have a physical store?",
      answer: "Yes, we have flagship stores in New York, Los Angeles, and Chicago. Visit our Stores page for addresses and opening hours.",
      category: "company"
    },
  ];

  // Group FAQs by category
  const categories = [...new Set(faqs.map(faq => faq.category))];

  const getFaqsByCategory = (category: string) => {
    return faqs.filter(faq => faq.category === category);
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b",
      isDark 
        ? "from-gray-900 to-gray-800" 
        : "from-secondary/30 to-background"
    )}>
      <div className="container mx-auto px-4 py-24">
        <h1 className={cn(
          "text-3xl font-bold mb-8",
          isDark && "text-white"
        )}>
          Frequently Asked Questions
        </h1>
        
        <p className={cn(
          "text-lg mb-12",
          isDark && "text-gray-300"
        )}>
          Find answers to the most common questions about our products, shipping, returns, and more. 
          Can't find what you're looking for? {" "}
          <Link to="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>.
        </p>
        
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className={cn(
              "text-xl font-semibold mb-6 capitalize",
              isDark && "text-white"
            )}>
              {category} Questions
            </h2>
            
            <div className="space-y-4">
              {getFaqsByCategory(category).map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

type FAQItemProps = {
  question: string;
  answer: string;
  isDark: boolean;
};

const FAQItem = ({ question, answer, isDark }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className={cn(
      "transition-shadow",
      isDark
        ? "bg-gray-800/80 hover:shadow-md hover:shadow-gray-700/20 border-gray-700"
        : "bg-white/80 backdrop-blur-sm hover:shadow-md border-gray-200"
    )}>
      <CardContent className="p-0">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full"
        >
          <CollapsibleTrigger className="flex justify-between items-center w-full p-6 text-left">
            <h3 className={cn(
              "text-lg font-medium",
              isDark ? "text-white" : "text-gray-900"
            )}>
              {question}
            </h3>
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen ? "transform rotate-180" : "",
              isDark ? "text-gray-400" : "text-gray-500"
            )} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className={cn(
              "px-6 pb-6 pt-0",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              {isOpen ? (
                <div className="animate-fade-in-down">
                  {answer}
                </div>
              ) : (
                answer
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default FAQ;
