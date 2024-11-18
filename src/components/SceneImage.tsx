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
    console.log("Generating image for prompt:", message);
    
    try {
      const apiKey = import.meta.env.VITE_NEBIUS_API_KEY;
      if (!apiKey) {
        throw new Error("API key is not configured");
      }

      const response = await fetch("https://api.nebius.ai/v1/images/generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json",
          "Origin": window.location.origin
        },
        body: JSON.stringify({
          model: "stable-diffusion-v2",
          prompt: `Fantasy game scene: ${message}`,
          n: 1,
          size: "512x512",
          response_format: "url"
        }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response:", errorText);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);

      if (data.data?.[0]?.url) {
        setImageUrl(data.data[0].url);
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Error Generating Image",
        description: error instanceof Error 
          ? `Failed to generate image: ${error.message}` 
          : "Failed to generate image. Please try again.",
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
          {isLoading ? "Generating..." : "Generate Scene Image"}
        </Button>
      )}
    </div>
  );
};