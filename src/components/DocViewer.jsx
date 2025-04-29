import ReactMarkdown from "react-markdown";

export default function DocViewer({ content }) {
  return (
    <div className="doc-panel">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
