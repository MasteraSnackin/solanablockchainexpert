export const generateImage = async (prompt: string) => {
  try {
    const apiKey = import.meta.env.VITE_NEBIUS_API_KEY;
    if (!apiKey) {
      throw new Error("Nebius API key is not configured");
    }

    console.log("Generating image for prompt:", prompt);

    const response = await fetch("https://api.nebius.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    console.log("Generated image data:", data);
    return data.data[0].url;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};