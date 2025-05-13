
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useTheme } from "@/contexts/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      );
    }, 86400000); // Update every 24 hours
  
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className={`relative h-screen w-full overflow-hidden ${
      theme === "dark" 
        ? "bg-gradient-to-b from-primary/5 via-background to-accent/10" 
        : "bg-gradient-to-b from-primary/10 via-background to-secondary/20"
    }`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 h-80 w-80 rounded-full ${
          theme === "dark" ? "bg-primary/5" : "bg-primary/10"
        }`}></div>
        <div className={`absolute top-1/2 -left-20 h-40 w-40 rounded-full ${
          theme === "dark" ? "bg-primary/5" : "bg-primary/10"
        }`}></div>
        <div className={`absolute -bottom-20 right-1/2 h-60 w-60 rounded-full ${
          theme === "dark" ? "bg-accent/5" : "bg-accent/10"
        }`}></div>
      </div>
      
      <div className="container relative flex h-full flex-col items-center justify-center px-4 text-center">
        <span className={`animate-fade-in rounded-full ${
          theme === "dark" 
            ? "bg-primary/30 text-white font-medium" 
            : "bg-primary/20 text-white"
        } px-4 py-1.5 text-xs font-medium`}>
          New Collection {currentDate}
        </span>
        
        <h1 className="heading-xl mt-6 animate-fade-in animation-delay-100 max-w-xl text-balance">
          Discover Our Premium Collection of <span className={`${
            theme === "dark" 
              ? "text-white bg-primary/40 px-2 italic" 
              : "bg-white text-primary/90 px-2 italic"
          }`}>Essentials</span>
        </h1>
        
        <p className="mt-6 animate-fade-in animation-delay-200 max-w-xl text-lg text-muted-foreground">
          Minimalist design meets exceptional quality. Explore our curated collection of timeless pieces.
        </p>
        
        <div className="mt-10 flex animate-fade-in animation-delay-300 flex-col sm:flex-row items-center gap-4">
          <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
            Shop Now
          </Button>
          
          <Link 
            to="/products" 
            className={`group inline-flex items-center gap-1 text-sm font-medium ${
              theme === "dark" 
                ? "text-white hover:text-white/80" 
                : "text-primary hover:text-primary/80"
            } transition-colors`}
          >
            Explore Collection
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="animate-bounce">
          <svg 
            width="20" 
            height="10" 
            viewBox="0 0 20 10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M1 1L10 9L19 1" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
