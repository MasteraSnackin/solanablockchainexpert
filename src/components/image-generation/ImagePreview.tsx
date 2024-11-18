import { Image } from "lucide-react";
import { Button } from "../ui/button";

interface ImagePreviewProps {
  imageUrl: string | null;
  isLoading: boolean;
  onGenerate: () => void;
}

export const ImagePreview = ({ imageUrl, isLoading, onGenerate }: ImagePreviewProps) => {
  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Generated scene"
      className="w-full h-auto rounded-lg"
    />
  ) : (
    <Button
      onClick={onGenerate}
      disabled={isLoading}
      variant="outline"
      className="w-full"
      aria-label="Generate scene image"
    >
      <Image className="mr-2 h-4 w-4" aria-hidden="true" />
      {isLoading ? "Generating..." : "Generate Scene Image"}
    </Button>
  );
};