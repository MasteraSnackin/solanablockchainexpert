import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

export const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-message-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2",
          isBot ? "bg-chat-bot" : "bg-chat-user",
          "shadow-sm"
        )}
      >
        <p className="text-sm text-gray-800">{message}</p>
      </div>
    </div>
  );
};