import { useState } from "react";
import { Button } from "./ui/button";
import { Image } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface SceneImageProps {
  message: string;
}

export const SceneImage = ({ message }: SceneImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.nebius.ai/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_NEBIUS_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `Fantasy game scene: ${message}`,
          n: 1,
          size: "512x512",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      setImageUrl(data.data[0].url);
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please check your API key.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Generated scene"
          className="w-full h-auto rounded-lg"
        />
      ) : (
        <Button
          onClick={generateImage}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <Image className="mr-2 h-4 w-4" />
          Generate Scene Image
        </Button>
      )}
    </div>
  );
};