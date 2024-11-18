import { useState } from "react";
import { generateImage } from "@/utils/imageGeneration";
import { useToast } from "@/components/ui/use-toast";

interface GeneratedImageProps {
  prompt: string;
}

export const GeneratedImage = ({ prompt }: GeneratedImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateImage = async () => {
    try {
      setIsLoading(true);
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (error) {
      toast({
        title: "Image Generation Error",
        description: error instanceof Error ? error.message : "Failed to generate image",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {!imageUrl && !isLoading && (
        <button
          onClick={handleGenerateImage}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Generate Scene Image
        </button>
      )}
      {isLoading && <div className="animate-pulse">Generating image...</div>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated scene"
          className="rounded-lg shadow-lg max-w-full h-auto"
        />
      )}
    </div>
  );
};