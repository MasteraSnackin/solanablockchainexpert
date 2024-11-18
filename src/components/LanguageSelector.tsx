import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'zh', name: '中文' },
];

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const { toast } = useToast();

  const handleLanguageChange = async (langCode: string) => {
    setIsLoading(true);
    try {
      await i18n.changeLanguage(langCode);
      setCurrentLang(langCode);
      toast({
        title: t('Language Changed'),
        description: t('The application language has been updated.'),
      });
    } catch (error) {
      toast({
        title: t('Error'),
        description: t('Failed to change language. Please try again.'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 shrink-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Languages className="w-4 h-4" />
          )}
          {languages.find(lang => lang.code === currentLang)?.name || t('Language')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isLoading || currentLang === lang.code}
            className={currentLang === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};