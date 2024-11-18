import { Download, Copy, RefreshCw, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from "./LanguageSelector";

interface ChatOptionsProps {
  messages: Array<{ text: string; isBot: boolean }>;
  onRestart: () => void;
}

export const ChatOptions = ({ messages, onRestart }: ChatOptionsProps) => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t } = useTranslation();

  const copyChat = async () => {
    const chatLog = messages
      .map((msg) => `${msg.isBot ? "Bot" : "You"}: ${msg.text}`)
      .join("\n");
    
    try {
      await navigator.clipboard.writeText(chatLog);
      toast({
        title: t('Success'),
        description: t('Chat log copied to clipboard'),
      });
    } catch (error) {
      toast({
        title: t('Error'),
        description: t('Failed to copy chat log'),
        variant: "destructive",
      });
    }
  };

  const exportChat = () => {
    const chatLog = messages
      .map((msg) => `${msg.isBot ? "Bot" : "You"}: ${msg.text}`)
      .join("\n");
    
    const blob = new Blob([chatLog], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-log.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('Success'),
      description: t('Chat log exported'),
    });
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b">
      <Button
        variant="outline"
        size="sm"
        onClick={copyChat}
        className="flex items-center gap-2"
      >
        <Copy className="w-4 h-4" />
        {t('Copy Chat Logs')}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportChat}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        {t('Export Chat')}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onRestart}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        {t('Restart Chat')}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex items-center gap-2"
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
        {t('Dark Mode')}
      </Button>

      <div className="ml-auto">
        <LanguageSelector />
      </div>
    </div>
  );
};