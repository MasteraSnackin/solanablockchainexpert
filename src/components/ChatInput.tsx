import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t('Type a message...')}
        className="flex-1"
        disabled={disabled}
      />
      <Button type="submit" size="icon" disabled={disabled || !message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};