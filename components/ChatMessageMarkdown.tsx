// components/ChatMessageMarkdown.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessageMarkdown({ text }: { text: string }) {
  // Fix literal \n strings and ensure the parser sees them as actual line breaks
  const formattedText = text?.replace(/\\n/g, "\n");

  return (
    <div className="prose prose-sm max-w-none prose-slate">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{formattedText}</ReactMarkdown>
    </div>
  );
}
