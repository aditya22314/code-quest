import { Bookmark, Building2, FileText, HelpCircle, Home, Laptop, MessageSquare, Tag, Trophy, Users } from "lucide-react";
import Link from "next/link";

const sidebarLinks = [
    { label: "Home", icon: <Home size={18} />, href: "/" },
    { label: "Questions", icon: <HelpCircle size={18} />, href: "/questions" },
    { label: "AI Assist", icon: <Laptop size={18} />, href: "/ai", badge: "Labs" },
    { label: "Tags", icon: <Tag size={18} />, href: "/tags" },
    { label: "Users", icon: <Users size={18} />, href: "/users" },
    { label: "Saves", icon: <Bookmark size={18} />, href: "/saves" },
    { label: "Challenges", icon: <Trophy size={18} />, href: "/challenges", badge: "NEW" },
    { label: "Chat", icon: <MessageSquare size={18} />, href: "/chat" },
    { label: "Articles", icon: <FileText size={18} />, href: "/articles" },
    { label: "Companies", icon: <Building2 size={18} />, href: "/companies" },
];

export const LeftSidebar = () => {
    return (
        // Gave sticky so as to keep the sidebar fixed while scrolling  
        <aside className="sticky left-0 top-16 z-50 h-[calc(100vh-64px)] w-64 flex flex-col overflow-y-auto border-r bg-white p-4 pt-8 lg:block" > 
        <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors">
                    {link.icon}
                    {link.label}
                </Link>
            ))}
        </nav>
            
        </aside>
    )
}