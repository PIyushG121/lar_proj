"use client";

import { HeroVideoDialog } from "@/Components/magicui/hero-video-dialog";

export default function VideoTutorials({ videos }: { videos: any[] }) {
    return (
        <div className="bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-2xl p-6 h-fit transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">play_circle</span>
                    Video Tutorials
                </h3>
            </div>
            <div className="space-y-4">
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <div key={video.id} className="block group">
                            {video.link ? (
                                <HeroVideoDialog
                                    className="block"
                                    animationStyle="from-center"
                                    videoSrc={video.link}
                                    thumbnailSrc={video.thumbnail || "https://startup-template-sage.vercel.app/hero-light.png"}
                                    thumbnailAlt={video.title || "Video Thumbnail"}
                                />
                            ) : null}
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{video.title}</p>
                            <p className="text-xs text-gray-500">{video.duration || "5 min"}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 text-sm">No tutorials available.</div>
                )}
            </div>
            <button className="w-full mt-5 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors border border-dashed border-gray-300 dark:border-border-dark rounded-lg hover:border-gray-500">
                View All Tutorials
            </button>
        </div>
    );
}
