import MorphingText from "@/components/ui/morphing-text";
import { FocusCards } from "@/components/ui/focus-cards";
import Link from "next/link";
const cards = [
  {
    title: "学术与技术/Academic & Tech",
    src: "/WebSrc/Academic.jpg",
    slug: "Academic",
  },
  {
    title: "生活/Daily Life",
    src: "/photos/YonseiAutumn.jpg",
    slug: "Life",
  },
  {
    title: "项目/Projects",
    src: "/WebSrc/Project.jpg",
    slug: "Project",
  },
];

const texts = [
  "Hello",
  "Welcome",
  "To my",
  "Blog!"
];

export default function BlogMain() {
  return (
    <div className="p-8">
      {/* 顶部动画欢迎语 */}
      <div className="mb-8 flex justify-center">
        <MorphingText texts={texts} />
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={`/blogs/${card.slug}`}
              className="block group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <div className="relative w-full h-56">
                <img
                  src={card.src}
                  alt={card.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-800">
                <div className="text-xl font-bold text-center">{card.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
