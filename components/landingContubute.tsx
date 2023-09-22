import Link from "next/link";
import Image from "next/image";

export const LandingContrubute = () => {
    return (
        <div className="space-y-3 bg-gradient-to-r from-slate-600 to-slate-900 sm:px-32 px-10 py-16 sm:w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="col-span-7 place-self-center text-center sm:text-left">
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl space-y-5 font-semibold text-white">Want to contribute in Lumina AI?
                    </div>
                    <div className="text-sm md:text-xl font-light text-zinc-400">
                        Share your code expertise. Visit our GitHub and contribute.
                    </div>
                    <div className="text-lg font-semibold mt-3">
                        <Link href="https://github.com/Tusharknwl/Limina_AI">
                            <h1 className="text-blue-600 hover:text-blue-500">
                                Check out the GitHub repo
                            </h1>
                        </Link>
                    </div>
                </div>
                <div className="col-span-5 place-self-center">
                    <Image
                        src={"/logo0.png"}
                        alt="Lumina.AI Logo"
                        sizes="lg:100vw, md:50vw, 33vw"
                        width={300}
                        height={300}
                        quality={100}
                        className="rounded-md drop-shadow-xl"
                    />
                </div>

            </div>

        </div>

    );
}
