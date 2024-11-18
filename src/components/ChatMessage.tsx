import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in gap-3 px-4",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
          <Bot className="h-4 w-4 text-purple-600 dark:text-purple-300" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isBot 
            ? "bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" 
            : "bg-purple-600 dark:bg-purple-700",
          "shadow-sm"
        )}
      >
        <p className={cn(
          "text-sm leading-relaxed",
          isBot 
            ? "text-gray-800 dark:text-gray-200" 
            : "text-white"
        )}>
          {message}
        </p>
      </div>
      
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-purple-600 dark:bg-purple-700 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};