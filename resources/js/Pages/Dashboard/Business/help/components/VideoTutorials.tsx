"use client";

import React from "react";
import { HeroVideoDialog } from "@/Components/magicui/hero-video-dialog";
import { motion } from "framer-motion";

export default function VideoTutorials({ videos }: { videos: any[] }) {
    const [showAll, setShowAll] = React.useState(false);
    const displayedVideos = showAll ? videos : videos.slice(0, 3);

    return (
        <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/5 rounded-2xl p-6 h-fit shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                        <span className="material-symbols-outlined !text-2xl leading-none">play_circle</span>
                    </div>
                    Video Tutorials
                </h3>
            </div>
            <div className="space-y-6">
                {videos.length > 0 ? (
                    displayedVideos.map((video, index) => (
                        <motion.div 
                            key={video.id || index} 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="block group"
                        >
                            <div className="relative mb-3 rounded-xl overflow-hidden border border-gray-100 dark:border-white/5 group-hover:border-primary/50 transition-colors bg-gray-100 dark:bg-white/5 aspect-video">
                                {video.link ? (
                                    <HeroVideoDialog
                                        className="w-full h-full"
                                        animationStyle="from-center"
                                        videoSrc={video.link}
                                        thumbnailSrc={video.thumbnail || "https://startup-template-sage.vercel.app/hero-light.png"}
                                        thumbnailAlt={video.title || "Video Thumbnail"}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-700">video_library</span>
                                    </div>
                                )}
                            </div>
                            <div className="px-1">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{video.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="material-symbols-outlined !text-xs text-gray-400">schedule</span>
                                    <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">{video.duration || "5 min"} • 1.2k views</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
                         <span className="material-symbols-outlined text-4xl mb-2 opacity-20">movie</span>
                         <p className="text-sm font-medium">No tutorials available.</p>
                    </div>
                )}
            </div>
            {videos.length > 3 && (
                <button 
                    onClick={() => setShowAll(!showAll)}
                    className="w-full mt-8 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-white hover:bg-primary transition-all duration-300 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-xl hover:border-transparent hover:shadow-lg hover:shadow-primary/20"
                >
                    {showAll ? 'Show Less' : 'View All Tutorials'}
                </button>
            )}
        </div>
    );
}
