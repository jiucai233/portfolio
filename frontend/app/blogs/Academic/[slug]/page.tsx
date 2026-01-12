import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { notFound } from "next/navigation";
import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

// Generate static params for all existing blog folders
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "app/blogs/Academic");
  
  if (!fs.existsSync(dir)) return [];

  const folders = fs.readdirSync(dir).filter(name => {
    const fullPath = path.join(dir, name);
    return fs.statSync(fullPath).isDirectory() && !name.startsWith("[") && name !== "temp";
  });

  return folders.map((slug) => ({
    slug: slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Decode slug in case of URL encoding issues
  const decodedSlug = decodeURIComponent(slug);

  const dir = path.join(process.cwd(), "app/blogs/Academic");
  const filePath = path.join(dir, decodedSlug, "index.md");

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link 
        href="/blogs/Academic" 
        className="inline-flex items-center text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 mb-8 transition-colors group"
      >
        <BsArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> Back to List
      </Link>

      <header className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100 leading-tight">
          {data.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {data.date && (
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <time>{data.date}</time>
            </div>
          )}
          
          {data.tags && data.tags.length > 0 && (
            <div className="flex gap-2 items-center flex-wrap">
              <span className="mr-1">🏷️</span>
              {data.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>
      
      {/* Markdown Content Area */}
      <div className="prose prose-lg dark:prose-invert max-w-none 
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:shadow-lg
        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700
      ">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.9em',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={`${className} bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 px-1 py-0.5 rounded font-mono text-sm`}>
                  {children}
                </code>
              )
            },
            // Enhance other elements
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-1 italic bg-gray-50 dark:bg-gray-800/50 rounded-r text-gray-700 dark:text-gray-300">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 whitespace-nowrap text-sm border-b border-gray-200 dark:border-gray-700">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
