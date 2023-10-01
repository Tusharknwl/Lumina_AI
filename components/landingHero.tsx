"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TypewriterComponent from "typewriter-effect";
import { Button } from "./ui/button";
import Image from "next/image";

export const LandingHero = () => {
    const { isSignedIn } = useAuth();
    return (
        <div className="text-white text-center font-bold py-36 space-y-5 px-10">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl space-y-5 font-extrabold">
                <h1>Experience Limitless Possibilities at Lumina.AI</h1>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    <TypewriterComponent
                        options={{
                            strings: [
                                "Chatbot.",
                                "Code Generator.",
                                "Image Generator.",
                                "Music Generator.",
                                "Video Generator.",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Your AI-Powered Playground Awaits!
            </div>
            <div>
                <Link href={isSignedIn ? "/dashboard" : "sign-up"}>
                    <Button
                        variant="ghost"
                        className="md:text-lg p-4 md:p-6 rounded-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-500"
                    >
                        Launch App
                    </Button>
                </Link>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Login For Free
            </div>
            <div className="rounded-full flex shadow-emerald-50 p-10 mx-auto justify-center">
                <Image
                    src={"/banner.png"}
                    alt="Lumina.AI Banner"
                    sizes="lg:100vw, md:50vw, 33vw"
                    width={1200}
                    height={800}
                    quality={100}
                    unoptimized
                    className="rounded-md drop-shadow-xl justify-center items-center hidden sm:flex"
                />
            </div>
            <div className="rounded-full flex shadow-emerald-50  mx-auto justify-center">
                <Image
                    src={"/banner.png"}
                    alt="Lumina.AI Banner"
                    width={1200}
                    height={800}
                    quality={100}
                    unoptimized
                    className="rounded-md drop-shadow-xl  hidden max-sm:flex"
                />
            </div>
        </div>
    );
};
