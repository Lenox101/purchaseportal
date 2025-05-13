
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn(
      "flex items-start mb-4",
      isUser ? "flex-row-reverse" : ""
    )}>
      <Avatar className={cn("h-8 w-8", isUser ? "ml-2" : "mr-2")}>
        <div className={cn(
          "flex h-full w-full items-center justify-center rounded-full text-white",
          isUser ? "bg-accent" : "bg-primary"
        )}>
          <User size={16} />
        </div>
      </Avatar>
      
      <div className={cn(
        "rounded-lg p-3 max-w-[80%]",
        isUser 
          ? "bg-gradient-purple text-white" 
          : "glass-card text-foreground"
      )}>
        <p className="break-words">{message}</p>
        <p className={cn(
          "text-xs mt-1",
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
