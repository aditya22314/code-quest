import { Navbar } from "@/components/Navbar";
import { LeftSidebar } from "@/components/sidebar/LeftSidebar";
import { RightSidebar } from "@/components/sidebar/RightSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1440px] justify-center">
        <LeftSidebar />
        <main className="flex-1 min-w-0 max-w-[800px] min-h-screen border-x border-gray-100 p-6">
          {children}
        </main>
        <RightSidebar />
      </div>
    </>
  );
}
