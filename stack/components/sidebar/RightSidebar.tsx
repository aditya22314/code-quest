import { Pencil, MessageSquare, StickyNote, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RightSidebar = () => {
  return (
    <aside className="sticky right-0 top-16 z-20 hidden w-80 flex-col overflow-y-auto p-4 xl:flex">
      <div className="flex flex-col gap-4">
        {/* Overflow Blog Section */}
        <section className="overflow-hidden rounded-lg border border-yellow-200 bg-yellow-50">
          <div className="bg-yellow-100/50 px-3 py-2 text-xs font-bold text-gray-700">
            The Overflow Blog
          </div>
          <div className="flex flex-col gap-3 p-3">
            <div className="flex gap-2">
              <Pencil className="mt-1 shrink-0 text-gray-500" size={14} />
              <p className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
                A new era of Stack Overflow
              </p>
            </div>
            <div className="flex gap-2">
              <Pencil className="mt-1 shrink-0 text-gray-500" size={14} />
              <p className="text-sm text-gray-700 hover:text-orange-600 cursor-pointer">
                How your favorite movie is changing language learning technology
              </p>
            </div>
          </div>
        </section>

        {/* Featured on Meta Section */}
        <section className="overflow-hidden rounded-lg border border-yellow-200 bg-yellow-50">
          <div className="bg-yellow-100/50 px-3 py-2 text-xs font-bold text-gray-700">
            Featured on Meta
          </div>
          <div className="flex flex-col gap-3 p-3 text-sm">
            <div className="flex gap-2">
              <MessageSquare className="mt-1 shrink-0 text-gray-500" size={14} />
              <p className="text-gray-700 hover:text-orange-600 cursor-pointer">
                Results of the June 2025 Community Asks Sprint
              </p>
            </div>
            <div className="flex gap-2">
              <MessageSquare className="mt-1 shrink-0 text-gray-500" size={14} />
              <p className="text-gray-700 hover:text-orange-600 cursor-pointer">
                Will you help build our new visual identity?
              </p>
            </div>
            <div className="flex gap-2">
              <StickyNote className="mt-1 shrink-0 text-gray-500" size={14} />
              <p className="text-gray-700 hover:text-orange-600 cursor-pointer">
                Policy: Generative AI (e.g., ChatGPT) is banned
              </p>
            </div>
          </div>
        </section>

        {/* Custom Filters Section */}
        <section className="mt-4 flex flex-col gap-3">
          <h3 className="text-base font-semibold text-gray-800">Custom Filters</h3>
          <Button variant="outline" className="w-fit text-blue-600 border-blue-200 hover:bg-blue-50">
            Create a custom filter
          </Button>
        </section>

        {/* Watched Tags Section */}
        <section className="mt-6 flex flex-col items-center gap-4 text-center">
          <h3 className="w-full text-left text-base font-semibold text-gray-800">Watched Tags</h3>
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="rounded-full bg-gray-50 p-4">
              <Eye className="text-gray-300" size={32} />
            </div>
            <p className="text-xs text-gray-500 px-4">
              Watch tags to curate your list of questions.
            </p>
            <Button variant="outline" className="flex gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
              <Eye size={16} />
              Watch a tag
            </Button>
          </div>
        </section>

        <div className="mt-8 text-center text-[10px] font-bold tracking-widest text-gray-200/50">
            NULICLASS
        </div>
      </div>
    </aside>
  );
};
