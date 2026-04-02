import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-slate-900 mb-3 mt-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-slate-900 mb-2 mt-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-slate-900 mb-2 mt-3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-sm font-semibold text-slate-900 mb-1 mt-2" {...props} />,
          p:  ({ node, ...props }) => <p  className="text-slate-700 leading-relaxed mb-3" {...props} />,
          a:  ({ node, ...props }) => <a  className="text-indigo-600 hover:text-indigo-700 underline transition-colors" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-3 text-slate-700" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-slate-700" {...props} />,
          li: ({ node, ...props }) => <li className="text-slate-700 leading-relaxed" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
          em:     ({ node, ...props }) => <em className="italic text-slate-700" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-indigo-300 pl-4 py-1 my-3 bg-indigo-50/50 rounded-r-lg text-slate-600 italic"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="" {...props}>
                {children}
              </code>
            );
          },
          // ✅ Added from image line 42 — pre component
          pre: ({ node, ...props }) => <pre className="rounded-xl overflow-x-auto my-3 text-sm shadow-sm" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;