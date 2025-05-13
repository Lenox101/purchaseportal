
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, User, PaperclipIcon } from "lucide-react";
import ChatMessage from "@/components/ChatMessage";
import { useToast } from "@/hooks/use-toast";

// Mock data for example messages
const initialMessages = [
  {
    id: 1,
    text: "Hello! How can I help you today?",
    sender: "agent",
    timestamp: new Date(Date.now() - 3600000)
  }
];

const Chat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate agent typing
    setIsTyping(true);
    
    // Simulate agent response after delay
    setTimeout(() => {
      const agentMessage = {
        id: Date.now() + 1,
        text: getAgentResponse(newMessage),
        sender: "agent",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
      
      toast({
        title: "New message",
        description: "You have received a new message from customer support."
      });
    }, 1500);
  };

  // Simple response logic (would be replaced with actual backend in production)
  const getAgentResponse = (message: string) => {
    const lowercaseMsg = message.toLowerCase();
    
    if (lowercaseMsg.includes("hello") || lowercaseMsg.includes("hi")) {
      return "Hello there! How can I assist you today?";
    } else if (lowercaseMsg.includes("shipping") || lowercaseMsg.includes("delivery")) {
      return "Our standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days. Would you like more information about our shipping options?";
    } else if (lowercaseMsg.includes("return") || lowercaseMsg.includes("refund")) {
      return "We have a 30-day return policy. You can initiate a return from your account dashboard or contact our customer service team for assistance.";
    } else if (lowercaseMsg.includes("price") || lowercaseMsg.includes("discount")) {
      return "We regularly offer seasonal discounts and promotions. You can subscribe to our newsletter to be informed about upcoming sales.";
    } else {
      return "Thank you for your message. Our customer service team will review your inquiry and get back to you shortly.";
    }
  };

  return (
    <div className="container max-w-4xl py-20">
      <h1 className="text-3xl font-bold mb-8">Customer Support Chat</h1>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-primary/5 p-4 border-b">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4">
              <div className="bg-primary flex h-full w-full items-center justify-center rounded-full text-white">
                <User size={20} />
              </div>
            </Avatar>
            <div>
              <h2 className="font-semibold">Customer Support</h2>
              <p className="text-sm text-muted-foreground">Online now</p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[500px] p-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              message={message.text}
              isUser={message.sender === "user"}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && (
            <div className="flex items-center mb-4">
              <Avatar className="h-8 w-8 mr-2">
                <div className="bg-primary flex h-full w-full items-center justify-center rounded-full text-white">
                  <User size={16} />
                </div>
              </Avatar>
              <div className="bg-primary/5 rounded-lg p-2 px-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </ScrollArea>
        
        <Separator />
        
        <form onSubmit={handleSendMessage} className="p-4 bg-card">
          <div className="flex items-end gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="resize-none min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="rounded-full"
                onClick={() => toast({
                  title: "File upload",
                  description: "File upload functionality will be implemented soon.",
                })}
              >
                <PaperclipIcon size={18} />
              </Button>
              <Button type="submit" size="icon" className="rounded-full">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
        <p className="font-medium mb-2">Chat Support Hours:</p>
        <p>Monday - Friday: 9am - 8pm EST</p>
        <p>Saturday - Sunday: 10am - 6pm EST</p>
        <p className="mt-2 text-muted-foreground">
          Please note that messages sent outside of these hours will be responded to during the next business day.
        </p>
      </div>
    </div>
  );
};

export default Chat;
