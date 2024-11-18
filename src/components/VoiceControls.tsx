import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';

interface VoiceControlsProps {
  speed: number;
  pitch: number;
  volume: number;
  onSpeedChange: (value: number[]) => void;
  onPitchChange: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
}

export const VoiceControls = ({
  speed,
  pitch,
  volume,
  onSpeedChange,
  onPitchChange,
  onVolumeChange,
}: VoiceControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
      <div className="space-y-2">
        <Label>{t('Speed')}: {speed.toFixed(1)}x</Label>
        <Slider
          value={[speed]}
          onValueChange={onSpeedChange}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('Pitch')}: {pitch.toFixed(1)}</Label>
        <Slider
          value={[pitch]}
          onValueChange={onPitchChange}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('Volume')}: {(volume * 100).toFixed(0)}%</Label>
        <Slider
          value={[volume]}
          onValueChange={onVolumeChange}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>
    </div>
  );
};