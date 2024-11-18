import { useComfyUI } from "@/hooks/useComfyUI";
import { ImagePreview } from "./image-generation/ImagePreview";
import { ComfyUIError } from "./image-generation/ComfyUIError";

interface SceneImageProps {
  message: string;
}

export const SceneImage = ({ message }: SceneImageProps) => {
  const { isLoading, imageUrl, isComfyUIError, generateImage } = useComfyUI();

  const handleGenerate = () => {
    generateImage(message);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
      {isComfyUIError && <ComfyUIError />}
      <ImagePreview 
        imageUrl={imageUrl}
        isLoading={isLoading}
        onGenerate={handleGenerate}
      />
    </div>
  );
};