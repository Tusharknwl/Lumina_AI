"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const font = Montserrat({
    weight: "600",
    subsets: ["latin"]
});

export const LandingNavbar = () => {
    const { isSignedIn } = useAuth();

    return (
        <nav className="sticky top-0 z-40 w-full backdrop-blur bg-transparent">
            <div className=" mx-auto p-5 justify-between flex">
                <Link href="/" className="flex items-center">
                    <div className="relative h-8 w-8 mr-4">
                        <Image 
                            src="/logo0.png" 
                            layout="fill" 
                            alt="Logo"
                            />
                       
                    </div>
                    <h1 className={cn("text-2xl font-bold text-white", font.className)}>Lumina.AI</h1>
                </Link>
                <div className="flex items center gap-x-2">
                    <Link href={isSignedIn? "/dashboard" : "/sign-up"}>
                        <Button variant="ghost" className="rounded-full text-white bg-gradient-to-r from-purple-400 to-pink-500">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
            
            
        </nav>
    )
}