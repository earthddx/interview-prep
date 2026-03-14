import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ children, language = 'javascript' }) {
  const code = typeof children === 'string' ? children : String(children);
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: '10px 0',
        borderRadius: '6px',
        fontSize: '13px',
        lineHeight: '1.6',
      }}
    >
      {code.replace(/^\n/, '')}
    </SyntaxHighlighter>
  );
}
