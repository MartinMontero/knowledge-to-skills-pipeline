"use client";

import ReactMarkdown from "react-markdown";

/**
 * Safe markdown renderer. react-markdown does not render raw HTML by default,
 * so untrusted model/skill output cannot inject markup. Colors inherit from the
 * parent container so the same component works on light and dark surfaces.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`space-y-3 text-sm leading-relaxed ${className ?? ""}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-semibold mt-3 mb-1.5">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>,
          p: ({ children }) => <p className="my-2">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-current/30 pl-4 italic opacity-90 my-2">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-current/10 px-1.5 py-0.5 font-mono text-[0.85em]">{children}</code>
          ),
          pre: ({ children }) => (
            <pre className="rounded-lg bg-current/10 p-3 overflow-x-auto font-mono text-xs my-3">{children}</pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3">
              <table className="w-full text-left border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b border-current/20 px-2 py-1 font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b border-current/10 px-2 py-1 align-top">{children}</td>,
          hr: () => <hr className="my-4 border-current/15" />,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
