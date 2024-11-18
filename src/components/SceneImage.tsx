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
      // ComfyUI runs locally by default on port 8188
      const response = await fetch("http://127.0.0.1:8188/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: {
            "3": {
              "inputs": {
                "text": `Fantasy game scene: ${message}`,
                "clip": ["4", 0]
              },
              "class_type": "CLIPTextEncode"
            },
            "4": {
              "inputs": {
                "ckpt_name": "sd_xl_base_1.0.safetensors"
              },
              "class_type": "CheckpointLoaderSimple"
            },
            "5": {
              "inputs": {
                "seed": Math.floor(Math.random() * 1000000),
                "steps": 20,
                "cfg": 8,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1,
                "model": ["4", 0],
                "positive": ["3", 0],
                "negative": ["6", 0],
                "latent_image": ["7", 0]
              },
              "class_type": "KSampler"
            },
            "6": {
              "inputs": {
                "text": "ugly, bad quality, blurry",
                "clip": ["4", 0]
              },
              "class_type": "CLIPTextEncode"
            },
            "7": {
              "inputs": {
                "width": 512,
                "height": 512,
                "batch_size": 1
              },
              "class_type": "EmptyLatentImage"
            },
            "8": {
              "inputs": {
                "samples": ["5", 0],
                "vae": ["4", 2]
              },
              "class_type": "VAEDecode"
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`ComfyUI API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // ComfyUI returns a prompt ID that we need to use to get the actual image
      if (data.prompt_id) {
        // Poll for the image result
        const checkResult = async () => {
          const historyResponse = await fetch(`http://127.0.0.1:8188/history/${data.prompt_id}`);
          const historyData = await historyResponse.json();
          
          if (historyData[data.prompt_id]?.outputs?.[8]?.images?.[0]) {
            const imageName = historyData[data.prompt_id].outputs[8].images[0].filename;
            setImageUrl(`http://127.0.0.1:8188/view?filename=${imageName}`);
            setIsLoading(false);
          } else {
            // Check again in 1 second
            setTimeout(checkResult, 1000);
          }
        };
        
        checkResult();
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