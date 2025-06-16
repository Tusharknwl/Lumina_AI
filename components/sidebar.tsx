"use client";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  History,
  VideoIcon,
} from "lucide-react";

const montserrat = Montserrat({
  weight: "600",
  subsets: ["latin"],
});

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Image Generation",
    icon: ImageIcon,
    color: "text-pink-700",
    href: "/image",
  },
  {
    label: "Video Generation",
    icon: VideoIcon,
    color: "text-orange-700",
    href: "/video",
  },
  {
    label: "Music Generation",
    icon: Music,
    color: "text-emerald-500",
    href: "/music",
  },
  {
    label: "Code Generation",
    icon: Code,
    color: "text-green-700",
    href: "/code",
  },
];

interface SidebarProps {
  onOpenHistory: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenHistory }) => {
  const pathname = usePathname();

  const handleHistoryClick = () => {
    console.log("History button clicked"); // Debug log
    if (onOpenHistory && typeof onOpenHistory === "function") {
      onOpenHistory();
    } else {
      console.error("onOpenHistory is not a function or is undefined");
    }
  };

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-3">
            <Image fill alt="Logo" src="/logo0.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            Lumina.AI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg hover:text-white hover:bg-white/10 transition",
                pathname === route.href
                  ? "text-white bg-white/10 "
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("w-6 h-6 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={onOpenHistory}
            className={cn(
              "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg hover:text-white hover:bg-white/10 transition text-zinc-400"
            )}
          >
            <div className="flex items-center flex-1">
              <History className="w-6 h-6 mr-3 text-indigo-500" />
              Chat History
            </div>
          </button>
        </div>
        {/* <div className="px-3 py-2">
          <button
            onClick={onOpenHistory}
            className="w-full flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white justify-start"
          >
            <History className="w-4 h-4" />
            Chat History
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
