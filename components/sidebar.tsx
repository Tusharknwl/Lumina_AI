"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

import { cn } from "@/lib/utils";
import { Code, ImageIcon, LayoutDashboard, MessageSquare, Music, Settings, VideoIcon } from "lucide-react";

const montserrat = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

const routes = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        color: "text-sky-500"
    },
    {
        label: 'Conversation',
        icon: MessageSquare,
        href: '/conversation',
        color: "text-violet-500",
    },
    {
        label: 'Image Generation',
        icon: ImageIcon,
        color: "text-pink-700",
        href: '/image',
    },
    {
        label: 'Video Generation',
        icon: VideoIcon,
        color: "text-orange-700",
        href: '/video',
    },
    {
        label: 'Music Generation',
        icon: Music,
        color: "text-emerald-500",
        href: '/music',
    },
    {
        label: 'Code Generation',
        icon: Code,
        color: "text-green-700",
        href: '/code',
    },
    {
        label: 'Settings',
        icon: Settings,
        href: '/settings',
    },

];

const Sidebar = () => {
    return ( 
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative w-8 h-8 mr-3">
                        <Image
                            fill
                            alt="Logo"
                            src="/logo.png"
                            />
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>
                            Lumina AI
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-lg hover:text-white hover:bg-white/10 transition"
                        >
                            <div className="flex items-center flex-1">
                                <route.icon
                                    className={cn("w-6 h-6 mr-3", route.color)} />
                                    {route.label}
                            </div>
                        </Link>
                        ))}
                </div>
            </div>
        </div>
     );
}
 
export default Sidebar;