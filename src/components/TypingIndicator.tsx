export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-4 py-2">
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-typing"></div>
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-typing delay-150"></div>
      <div className="h-2 w-2 rounded-full bg-gray-400 animate-typing delay-300"></div>
    </div>
  );
};