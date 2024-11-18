import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { GeneratedImage } from "./GeneratedImage";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mic, MicOff } from "lucide-react";

interface GameInterfaceProps {
  messages: Array<{ text: string; isBot: boolean }>;
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  isListening: boolean;
  toggleVoiceRecognition: () => void;
}

export const GameInterface = ({
  messages,
  isTyping,
  onSendMessage,
  isListening,
  toggleVoiceRecognition,
}: GameInterfaceProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const lastBotMessage = messages[messages.length - 1]?.isBot
    ? messages[messages.length - 1].text
    : null;

  const extractOptions = (message: string) => {
    const lines = message.split("\n");
    const options: string[] = [];

    for (const line of lines) {
      const match = line.match(/^\d+\.\s(.+)$/);
      if (match) {
        options.push(match[1].trim());
      }
    }

    return options;
  };

  const options = lastBotMessage ? extractOptions(lastBotMessage) : [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="space-y-4">
          <ChatMessage message={message.text} isBot={message.isBot} />
          {message.isBot && <GeneratedImage prompt={message.text} />}
        </div>
      ))}
      {isTyping && <TypingIndicator />}

      <div className="border-t p-4 space-y-4">
        <Tabs defaultValue="choices" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="choices">Quick Choices</TabsTrigger>
            <TabsTrigger value="custom">Custom Response</TabsTrigger>
            <TabsTrigger value="voice">Voice Input</TabsTrigger>
          </TabsList>
          <TabsContent value="choices">
            {options.length > 0 && (
              <div className="space-y-4">
                <RadioGroup
                  value={selectedOption}
                  onValueChange={setSelectedOption}
                >
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <Button
                  onClick={() => {
                    if (selectedOption) {
                      onSendMessage(selectedOption);
                      setSelectedOption("");
                    }
                  }}
                  disabled={!selectedOption || isTyping}
                  className="w-full"
                >
                  Choose Action
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="custom">
            <ChatInput onSend={onSendMessage} disabled={isTyping} />
          </TabsContent>
          <TabsContent value="voice" className="flex justify-center">
            <Button
              onClick={toggleVoiceRecognition}
              variant={isListening ? "destructive" : "default"}
              className="w-full flex items-center gap-2"
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};