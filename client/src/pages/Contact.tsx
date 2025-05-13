
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail,
  Phone, 
  MapPin,
  Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { isDark } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    console.log("Form submitted:", formData);
    
    // Show success message
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className={`container mx-auto px-4 py-24 min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gradient-light'}`}>
      <h1 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : ''}`}>Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : ''}`}>
            We're here to help! Fill out the form and our team will get back to you as soon as possible.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className={`mr-4 ${isDark ? 'text-primary/90' : 'text-primary'}`} />
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : ''}`}>Our Location</h3>
                <p className={isDark ? 'text-gray-400' : 'text-muted-foreground'}>
                  123 Design Street, Creative City, 10001
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className={`mr-4 ${isDark ? 'text-primary/90' : 'text-primary'}`} />
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : ''}`}>Phone Number</h3>
                <p className={isDark ? 'text-gray-400' : 'text-muted-foreground'}>+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail className={`mr-4 ${isDark ? 'text-primary/90' : 'text-primary'}`} />
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : ''}`}>Email Address</h3>
                <p className={isDark ? 'text-gray-400' : 'text-muted-foreground'}>hello@primepicks.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h3 className={`font-semibold mb-4 ${isDark ? 'text-white' : ''}`}>Business Hours</h3>
            <div className={`grid grid-cols-2 gap-2 ${isDark ? 'text-gray-300' : ''}`}>
              <p>Monday - Friday:</p>
              <p>9:00 AM - 6:00 PM</p>
              <p>Saturday:</p>
              <p>10:00 AM - 4:00 PM</p>
              <p>Sunday:</p>
              <p>Closed</p>
            </div>
          </div>
        </div>
        
        <div className={`${isDark ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 backdrop-blur-md border-white/20'} p-8 rounded-lg shadow-lg border`}>
          <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : ''}`}>Send Us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Order Inquiry"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={`flex w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                  isDark ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400' : 'bg-background border-input'
                }`}
                placeholder="How can we help you?"
              />
            </div>
            
            <Button type="submit" className="w-full">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
