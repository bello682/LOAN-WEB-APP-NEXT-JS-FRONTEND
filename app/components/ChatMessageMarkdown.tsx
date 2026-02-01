import ReactMarkdown from "react-markdown";

interface ChatMessageMarkdownProps {
  text: string;
  className?: string;
}

export default function ChatMessageMarkdown({ text, className = "" }: ChatMessageMarkdownProps) {
  return (
    <div className={className + " prose prose-blue max-w-none text-sm"}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
