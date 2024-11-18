import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useComfyUI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isComfyUIError, setIsComfyUIError] = useState(false);
  const { toast } = useToast();

  const checkComfyUIConnection = async () => {
    try {
      console.log("Checking ComfyUI connection...");
      const response = await fetch("http://127.0.0.1:8188/system_stats", {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      console.log("ComfyUI connection status:", response.ok);
      return response.ok;
    } catch (error) {
      console.error("ComfyUI connection check failed:", error);
      return false;
    }
  };

  const generateImage = async (message: string) => {
    console.log("Starting image generation for prompt:", message);
    setIsLoading(true);
    setIsComfyUIError(false);
    
    try {
      const isComfyUIRunning = await checkComfyUIConnection();
      if (!isComfyUIRunning) {
        setIsComfyUIError(true);
        throw new Error(
          "Cannot connect to ComfyUI. Please ensure ComfyUI is properly configured."
        );
      }

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
      console.log("ComfyUI response received:", data);
      
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
      console.error("Image generation failed:", error);
      toast({
        title: "Error Generating Image",
        description: error instanceof Error ? error.message : "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    imageUrl,
    isComfyUIError,
    generateImage
  };
};
