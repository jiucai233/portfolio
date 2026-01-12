import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function AcademicList() {
  const dir = path.join(process.cwd(), "app/blogs/Academic");
  const folders = fs.readdirSync(dir).filter(name => {
    const fullPath = path.join(dir, name);
    return fs.statSync(fullPath).isDirectory();
  });

  type BlogMeta = {
    slug: string;
    title?: string;
    language?: string;
    tags?: string[];
    summary?: string;
    draft?: boolean;
  };

  const blogs: BlogMeta[] = folders
    .map(folder => {
      const mdPath = path.join(dir, folder, "index.md");
      const file = fs.readFileSync(mdPath, "utf-8");
      const { data, content } = matter(file);
      
      // 修复 summary 提取逻辑
      let summary = data.summary;
      if (!summary) {
        // 如果没有定义 summary，从内容中提取前几段，但保留 Markdown 格式
        const contentLines = content.split('\n').filter(line => line.trim() !== '');
        summary = contentLines.slice(0, 5).join('\n');
      }
      
      return {
        slug: folder,
        title: data.title,
        language: data.language,
        tags: data.tags,
        draft: data.draft,
        summary,
      };
    })
    .filter(blog => blog.draft !== true);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">学术与技术博客/Academic & Tech Share</h1>
      <div className="space-y-8">
        {blogs.map(blog => (
          <article key={blog.slug} className="border-b border-gray-200 dark:border-gray-700 pb-8">
            <Link href={`/blogs/${blog.slug}`} className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors">
              <h2 className="text-xl font-semibold hover:text-blue-600 dark:hover:text-blue-400 mb-2">
                {blog.title}
              </h2>
              {blog.language && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  语言/Language: {blog.language}
                </div>
              )}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
            
            {blog.summary && (
              <div className="mt-4 px-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{

                      // 自定义链接渲染
                      a: ({ href, children, ...props }) => (
                        <a 
                          href={href} 
                          {...props} 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      // 自定义段落渲染
                      p: ({ children }) => (
                        <p className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                          {children}
                        </p>
                      ),
                      // 自定义加粗文本
                      strong: ({ children }) => (
                        <strong className="font-bold text-gray-900 dark:text-gray-100">
                          {children}
                        </strong>
                      ),
                      // 自定义斜体文本
                      em: ({ children }) => (
                        <em className="italic text-gray-800 dark:text-gray-200">
                          {children}
                        </em>
                      ),
                      // 自定义标题
                      h1: ({ children }) => (
                        <h1 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-1">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-gray-100">
                          {children}
                        </h3>
                      ),
                      // 自定义列表
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-3 space-y-1">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-3 space-y-1">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="text-gray-700 dark:text-gray-300">
                          {children}
                        </li>
                      ),
                      // 自定义引用块
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400 my-3 bg-gray-50 dark:bg-gray-800 py-2 rounded-r">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {blog.summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
