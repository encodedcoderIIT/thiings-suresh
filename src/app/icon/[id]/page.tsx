"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import { ThiingsIcon } from "@/types";
import thiingsData from "@/data/thiings_metadata_7000.json";

export default function IconPage() {
  const params = useParams();
  const iconId = params.id as string;

  // Find the icon by ID
  const icon = thiingsData.find((item) => item.id === iconId) as
    | ThiingsIcon
    | undefined;

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
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Layout */}
      <div className="hidden md:flex md:min-h-screen md:items-center">
        {/* Left side - Image */}
        <div className="w-1/2 flex items-center justify-center p-12 ml-4">
          <div className="relative">
            <Image
              src={icon.imageUrl}
              alt={icon.name}
              width={400}
              height={400}
              className="w-96 h-96 object-contain"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-1/2 flex flex-col justify-center px-12 py-16 mr-4">
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
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Grid
            </Link>
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
          <button className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          <button className="w-10 h-10 bg-white bg-opacity-80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col">
          {/* Mobile Image */}
          <div className="flex items-center justify-center py-16 px-8">
            <Image
              src={icon.imageUrl}
              alt={icon.name}
              width={300}
              height={300}
              className="w-72 h-72 object-contain"
              unoptimized
              priority
            />
          </div>

          {/* Mobile Content */}
          <div className="px-6 pb-8">
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
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
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
    </div>
  );
}
