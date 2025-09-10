"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Download, ArrowLeft, Volume2, Share, X, Check } from "lucide-react";
import { ThiingsIcon } from "@/types";
import thiingsData from "@/data/thiings_metadata_7000.json";

export default function IconPage() {
  const params = useParams();
  const router = useRouter();
  const iconId = params.id as string;

  // State management
  const [isNarrating, setIsNarrating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Find the icon by ID
  const icon = (thiingsData as ThiingsIcon[]).find(
    (item: ThiingsIcon) => item.id === iconId
  );

  if (!icon) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Icon not found
          </h1>
          <p className="text-gray-600 mb-8">
            The icon you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(icon.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${icon.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download "${icon.name}.png". Please try again.`);
    }
  };

  const handleNarrate = () => {
    if (isNarrating) {
      speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(icon.description);
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      speechSynthesis.speak(utterance);
      setIsNarrating(true);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/icon/${icon.id}`;
      await navigator.clipboard.writeText(url);
      setToastMessage(
        window.innerWidth < 768
          ? "URL copied to clipboard!"
          : "URL copied to clipboard!"
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Share failed:", error);
      setToastMessage("Failed to copy URL");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Desktop Controls */}
      <div className="hidden md:block absolute top-4 right-4 z-10">
        <div className="flex gap-2">
          <button
            onClick={handleNarrate}
            className={`w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-100 hover:shadow-md hover:ring-1 hover:ring-gray-300 transition-all duration-200 shadow-lg ${
              isNarrating ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Volume2
              className={`w-5 h-5 transition-colors duration-200 ${
                isNarrating
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-gray-800"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-100 hover:shadow-md hover:ring-1 hover:ring-gray-300 transition-all duration-200 shadow-lg"
          >
            <Share className="w-5 h-5 text-gray-700 hover:text-gray-800 transition-colors duration-200" />
          </button>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-100 hover:shadow-md hover:ring-1 hover:ring-gray-300 transition-all duration-200 shadow-lg"
          >
            <X className="w-5 h-5 text-gray-700 hover:text-gray-800 transition-colors duration-200" />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:min-h-screen md:items-center">
        {/* Left side - Image */}
        <div className="w-1/2 flex items-center justify-center p-16 ml-12">
          <div className="relative">
            <Image
              src={icon.imageUrlPreview || icon.imageUrl}
              alt={icon.name}
              width={500}
              height={500}
              className="w-[500px] h-[500px] object-contain"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-1/2 flex flex-col justify-center px-16 py-16 mr-12">
          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {icon.categories.map((category, index) => (
              <span
                key={index}
                className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-black mb-6 leading-tight">
            {icon.name}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {icon.description}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grid
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* Mobile Header with Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleNarrate}
            className={`w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-100 hover:shadow-md hover:ring-1 hover:ring-gray-300 transition-all duration-200 ${
              isNarrating ? "ring-2 ring-blue-500" : ""
            }`}
          >
            <Volume2
              className={`w-5 h-5 transition-colors duration-200 ${
                isNarrating
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-gray-800"
              }`}
            />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-100 hover:shadow-md hover:ring-1 hover:ring-gray-300 transition-all duration-200"
          >
            <Share className="w-5 h-5 text-gray-700 hover:text-gray-800 transition-colors duration-200" />
          </button>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-200 hover:bg-opacity-100 hover:shadow-md hover:ring-1 hover:ring-gray-300 transition-all duration-200"
          >
            <X className="w-5 h-5 text-gray-700 hover:text-gray-800 transition-colors duration-200" />
          </button>
        </div>

        <div className="flex flex-col">
          {/* Mobile Image */}
          <div className="flex items-center justify-center py-12 px-12">
            <Image
              src={icon.imageUrlPreview || icon.imageUrl}
              alt={icon.name}
              width={300}
              height={300}
              className="w-72 h-72 object-contain"
              unoptimized
              priority
            />
          </div>

          {/* Mobile Content */}
          <div className="px-8 pb-12">
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {icon.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-700"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-black mb-4 leading-tight">
              {icon.name}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {icon.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <>
          {/* Mobile Toast */}
          <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-black text-white rounded-full shadow-lg transition-all duration-300">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>

          {/* Desktop Toast */}
          <div className="hidden md:flex fixed top-20 right-4 z-50 items-center gap-2 px-4 py-3 bg-black text-white rounded-full shadow-lg transition-all duration-300">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </>
      )}
    </div>
  );
}
