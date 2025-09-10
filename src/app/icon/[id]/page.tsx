"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Download, ArrowLeft, Copy, Check } from "lucide-react";
import { ThiingsIcon } from "@/types";
import thiingsData from "@/data/thiings_metadata_7000.json";
import { useState } from "react";

export default function IconPage() {
  const params = useParams();
  const iconId = params.id as string;
  const [copied, setCopied] = useState(false);

  // Find the icon by ID
  const icon = thiingsData.find((item) => item.id === iconId) as
    | ThiingsIcon
    | undefined;

  if (!icon) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Icon not found
          </h1>
          <p className="text-gray-600 mb-8">
            The icon you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
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

  const handleCopyName = async () => {
    try {
      await navigator.clipboard.writeText(icon.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Icons
            </Link>

            <h1 className="text-xl font-semibold text-gray-900">
              Icon Details
            </h1>

            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Icon Display */}
            <div className="flex flex-col items-center">
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="relative w-48 h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <Image
                    src={icon.imageUrl}
                    alt={icon.name}
                    width={192}
                    height={192}
                    className="w-48 h-48 object-contain"
                    unoptimized
                  />
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PNG
                </button>
              </div>
            </div>

            {/* Icon Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon Name
                </label>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">
                    {icon.name}
                  </h1>
                  <button
                    onClick={handleCopyName}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy name"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {icon.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <p className="text-gray-600 leading-relaxed">
                    {icon.description}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {icon.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Information
                </label>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="font-medium">PNG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File name:</span>
                    <span className="font-medium font-mono text-xs">
                      {icon.name}.png
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-medium font-mono text-xs">
                      {icon.id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Usage Tips
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• High-quality PNG format suitable for web and print</li>
                  <li>• Transparent background for easy integration</li>
                  <li>• Scalable vector-based design</li>
                  <li>• Free for commercial and personal use</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Icons */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Related Icons
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {thiingsData
              .filter(
                (item) =>
                  item.id !== icon.id &&
                  item.categories.some((cat: string) =>
                    icon.categories.includes(cat)
                  )
              )
              .slice(0, 12)
              .map((relatedIcon) => (
                <Link
                  key={relatedIcon.id}
                  href={`/icon/${relatedIcon.id}`}
                  className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4 aspect-square flex flex-col items-center justify-center"
                >
                  <div className="relative w-12 h-12 mb-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-lg">🖼️</div>
                  </div>
                  <h3 className="text-xs font-medium text-gray-900 text-center line-clamp-2">
                    {relatedIcon.name}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
