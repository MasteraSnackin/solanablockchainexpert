import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from "./LanguageSelector";

interface SettingsPanelProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const SettingsPanel = ({ isDarkMode, setIsDarkMode }: SettingsPanelProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 shrink-0"
        onClick={() => setIsDarkMode(!isDarkMode)}
        aria-label={isDarkMode ? t('Switch to light mode') : t('Switch to dark mode')}
      >
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        {t('Dark Mode')}
      </Button>
      <LanguageSelector />
    </div>
  );
};