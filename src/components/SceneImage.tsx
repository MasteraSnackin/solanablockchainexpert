import { useState } from "react";
import { Button } from "./ui/button";
import { Image, AlertCircle } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription } from "./ui/alert";

interface SceneImageProps {
  message: string;
}

export const SceneImage = ({ message }: SceneImageProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComfyUIError, setIsComfyUIError] = useState(false);
  const { toast } = useToast();

  const checkComfyUIConnection = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8188/system_stats", {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      return response.ok;
    } catch (error) {
      console.error("ComfyUI connection check failed:", error);
      return false;
    }
  };

  const generateImage = async () => {
    setIsLoading(true);
    setIsComfyUIError(false);
    
    try {
      // First check if ComfyUI is running
      const isComfyUIRunning = await checkComfyUIConnection();
      if (!isComfyUIRunning) {
        setIsComfyUIError(true);
        throw new Error(
          "Cannot connect to ComfyUI. Please ensure:\n" +
          "1. ComfyUI is installed and running on port 8188\n" +
          "2. CORS is enabled in ComfyUI\n" +
          "3. You're accessing this page via http://localhost instead of other domains"
        );
      }

      console.log("Generating image for prompt:", message);
      
      const response = await fetch("http://127.0.0.1:8188/prompt", {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
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
        console.error("ComfyUI API error:", response.status, response.statusText);
        throw new Error(`ComfyUI API request failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("ComfyUI response:", data);
      
      if (data.prompt_id) {
        const checkResult = async () => {
          const historyResponse = await fetch(`http://127.0.0.1:8188/history/${data.prompt_id}`, {
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin': '*',
            }
          });
          const historyData = await historyResponse.json();
          
          if (historyData[data.prompt_id]?.outputs?.[8]?.images?.[0]) {
            const imageName = historyData[data.prompt_id].outputs[8].images[0].filename;
            setImageUrl(`http://127.0.0.1:8188/view?filename=${imageName}`);
            setIsLoading(false);
          } else {
            setTimeout(checkResult, 1000);
          }
        };
        
        checkResult();
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Error Generating Image",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
      {isComfyUIError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ComfyUI is not running. Please make sure to:
            <ol className="list-decimal ml-4 mt-2">
              <li>Install ComfyUI locally</li>
              <li>Start ComfyUI server on port 8188</li>
              <li>Ensure the SD XL model is available</li>
              <li>Access this page via http://localhost</li>
              <li>Enable CORS in ComfyUI</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}
      
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