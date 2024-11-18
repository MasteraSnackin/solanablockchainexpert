import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useToast } from "@/components/ui/use-toast";

interface ChatControlsProps {
  messages: Array<{ text: string; isBot: boolean }>;
  onRestart: () => void;
}

export const ChatControls = ({ messages, onRestart }: ChatControlsProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const copyChatlogs = () => {
    const chatLogs = messages
      .map(msg => `${msg.isBot ? t("Game Master") : t("Player")}: ${msg.text}`)
      .join("\n\n");
    
    navigator.clipboard.writeText(chatLogs).then(() => {
      toast({
        title: t("Chat logs copied!"),
        description: t("The chat history has been copied to your clipboard."),
      });
    }).catch(() => {
      toast({
        title: t("Failed to copy"),
        description: t("Could not copy chat logs to clipboard."),
        variant: "destructive",
      });
    });
  };

  const exportChat = () => {
    const chatLogs = messages
      .map(msg => `${msg.isBot ? t("Game Master") : t("Player")}: ${msg.text}`)
      .join("\n\n");
    
    const blob = new Blob([chatLogs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat-export.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t("Chat exported!"),
      description: t("The chat history has been downloaded as a text file."),
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 shrink-0"
        onClick={copyChatlogs}
        aria-label={t('Copy chat logs to clipboard')}
      >
        <Copy className="w-4 h-4" />
        {t('Copy Chat Logs')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 shrink-0"
        onClick={exportChat}
        aria-label={t('Export chat history')}
      >
        <Download className="w-4 h-4" />
        {t('Export Chat')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 shrink-0"
        onClick={onRestart}
        aria-label={t('Restart chat')}
      >
        <RefreshCw className="w-4 h-4" />
        {t('Restart Chat')}
      </Button>
    </div>
  );
};