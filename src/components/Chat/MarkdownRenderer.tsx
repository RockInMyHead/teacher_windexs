/**
 * MarkdownRenderer - Component for rendering markdown content with streaming support
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer = React.memo(({ content, isStreaming = false }: MarkdownRendererProps) => {
  // Нормализуем текст для правильной обработки UTF-8
  const normalizedContent = content.normalize('NFC');

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={normalizedContent}
        components={{
          // Simplified components without extra icons and animations
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-4 mt-6 text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold mb-3 mt-5 text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-medium mb-2 mt-4 text-foreground">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-medium mb-2 mt-3 text-foreground">
              {children}
            </h4>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm">
              {children}
            </li>
          ),
          p: ({ children }) => (
            <p className="mb-3 leading-relaxed text-sm">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-border pl-4 py-2 my-4 italic">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
                {children}
              </code>
            );
          },
          hr: () => (
            <hr className="border-t border-border my-6" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-muted px-3 py-2 text-left font-semibold text-sm">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-sm">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
