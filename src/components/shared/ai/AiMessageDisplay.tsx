import { CSSProperties, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaRegCopy } from "react-icons/fa";

interface AiMessageDisplayProps {
  text: string;
}

export default function AiMessageDisplay({ text }: AiMessageDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <ReactMarkdown
        className="prose-sm"
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <div className="relative rounded-md overflow-hidden">
                <div className="flex justify-between items-center bg-gray-800 px-4 py-2 text-white text-xs font-mono">
                  <span>{match[1]}</span>
                  <CopyToClipboard
                    text={String(children).replace(/\n$/, "")}
                    onCopy={handleCopy}
                  >
                    <button className="p-1 rounded bg-gray-700 text-white text-xs flex items-center space-x-1">
                      {copied ? (
                        "已複製！"
                      ) : (
                        <>
                          <FaRegCopy size={14} />
                          <span>複製程式碼</span>
                        </>
                      )}
                    </button>
                  </CopyToClipboard>
                </div>
                <SyntaxHighlighter
                  style={atomDark as SyntaxHighlighterProps}
                  language={match[1]}
                  PreTag="div"
                  // {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
