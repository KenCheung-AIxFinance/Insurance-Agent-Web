import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import AiMessageDisplay from "./AiMessageDisplay";

interface MessageItemProps {
  message: {
    id: string;
    text: string;
    sender: "user" | "ai";
  };
}

export default function MessageItem({ message }: MessageItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      key={message.id}
      className={`mb-4 flex flex-col ${
        message.sender === "user" ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`${
          message.sender === "user"
            ? "max-w-[70%] rounded-lg px-4 py-2 bg-blue-500 text-white"
            : "w-full"
        }`}
      >
        {message.sender === "user" ? (
          <ReactMarkdown
            className="prose-sm text-white"
            remarkPlugins={[remarkGfm]}
          >
            {message.text}
          </ReactMarkdown>
        ) : (
          <AiMessageDisplay text={message.text} />
        )}
      </div>
      <div
        className={`flex items-center space-x-2 mt-2 ${
          message.sender === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <CopyToClipboard text={message.text} onCopy={handleCopy}>
          <button className="p-1 rounded hover:bg-gray-200">
            {copied ? (
              <FaCheck size={16} className="text-gray-500" />
            ) : (
              <FaRegCopy size={16} className="text-gray-500" />
            )}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
}