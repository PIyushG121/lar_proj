import React, { useState, useRef, useEffect } from 'react';
import { RippleButton } from '@/Components/magicui/ripple-button';

interface MagicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
}

export const MagicModal: React.FC<MagicModalProps> = ({ isOpen, onClose, onCapture }) => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please allow permissions.");
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured-receipt.jpg", { type: "image/jpeg" });
                        onCapture(file);
                        stopCamera();
                        onClose();
                    }
                }, 'image/jpeg');
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onCapture(e.target.files[0]);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
            <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-lg mx-auto my-6 z-50 px-4">
                <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none dark:bg-gray-900 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                            Create Magic
                        </h3>
                        <button
                            className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-900 dark:hover:text-white text-3xl leading-none outline-none focus:outline-none transition-colors"
                            onClick={onClose}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="relative p-8 flex-auto flex flex-col items-center justify-center min-h-[300px] gap-6">

                        {!isCameraOpen ? (
                            <>
                                <div className="text-center mb-2">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Scan a receipt or upload an invoice to start the magic.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-800/50 transition-all group"
                                    >
                                        <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-3xl">upload_file</span>
                                        </div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-200">Upload Image</span>
                                        <span className="text-xs text-gray-500 mt-1">From Device</span>
                                    </button>

                                    <button
                                        onClick={startCamera}
                                        className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-800/50 transition-all group"
                                    >
                                        <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-3xl">photo_camera</span>
                                        </div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-200">Open Camera</span>
                                        <span className="text-xs text-gray-500 mt-1">Take a Photo</span>
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center gap-4">
                                <div className="relative w-full rounded-xl overflow-hidden bg-black aspect-video shadow-lg">
                                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                </div>
                                <canvas ref={canvasRef} className="hidden" />

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={stopCamera}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <RippleButton
                                        rippleColor="#ffffff"
                                        onClick={handleCapture}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined">camera</span>
                                            Capture
                                        </span>
                                    </RippleButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
