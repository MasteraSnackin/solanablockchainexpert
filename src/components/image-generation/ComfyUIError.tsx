import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

export const ComfyUIError = () => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" aria-hidden="true" />
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
);