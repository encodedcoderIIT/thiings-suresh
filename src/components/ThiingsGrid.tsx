"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import Link from "next/link";
import { Search, Download, Filter, X } from "lucide-react";
import { ThiingsIcon } from "@/types";

interface ThiingsGridProps {
  icons: ThiingsIcon[];
}

const ITEMS_PER_PAGE = 50;

export default function ThiingsGrid({ icons }: ThiingsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    icons.forEach((icon) => {
      icon.categories.forEach((category) => {
        if (category.trim()) {
          categories.add(category.trim());
        }
      });
    });
    return Array.from(categories).sort();
  }, [icons]);

  // Filter icons based on search term and selected categories
  const filteredIcons = useMemo(() => {
    return icons.filter((icon) => {
      const matchesSearch =
        searchTerm === "" ||
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.categories.some((cat) =>
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategories =
        selectedCategories.length === 0 ||
        selectedCategories.some((selectedCat) =>
          icon.categories.some(
            (iconCat) => iconCat.toLowerCase() === selectedCat.toLowerCase()
          )
        );

      return matchesSearch && matchesCategories;
    });
  }, [icons, searchTerm, selectedCategories]);

  // Get visible icons for infinite scroll
  const visibleIcons = useMemo(() => {
    return filteredIcons.slice(0, visibleItems);
  }, [filteredIcons, visibleItems]);

  // Handle category filter toggle
  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(category);
      if (isSelected) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && visibleItems < filteredIcons.length) {
          setVisibleItems((prev) =>
            Math.min(prev + ITEMS_PER_PAGE, filteredIcons.length)
          );
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [visibleItems, filteredIcons.length]);

  // Reset visible items when filters change
  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchTerm, selectedCategories]);

  // Handle direct download
  const handleDownload = useCallback(
    (e: React.MouseEvent, icon: ThiingsIcon) => {
      e.preventDefault();
      e.stopPropagation();
      // Demo version - images not included
      alert(`This is a demo version. In the full version, "${icon.name}.png" would download automatically.`);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Thiings</h1>
              <span className="ml-2 text-sm text-gray-500">
                {filteredIcons.length} icons
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {selectedCategories.length > 0 && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                  {selectedCategories.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Filter by Category
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {selectedCategories.length > 0 && (
              <button
                onClick={() => setSelectedCategories([])}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {visibleIcons.length} of {filteredIcons.length} icons
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Icons Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4"
        >
          {visibleIcons.map((icon) => (
            <Link
              key={icon.id}
              href={`/icon/${icon.id}`}
              className="group relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-4 aspect-square flex flex-col items-center justify-center"
            >
              {/* Icon Image */}
              <div className="relative w-16 h-16 mb-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-2xl">🖼️</div>
              </div>

              {/* Icon Name */}
              <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 mb-2">
                {icon.name}
              </h3>

              {/* Categories */}
              <div className="flex flex-wrap gap-1 justify-center mb-2">
                {icon.categories.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                  >
                    {category}
                  </span>
                ))}
                {icon.categories.length > 2 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    +{icon.categories.length - 2}
                  </span>
                )}
              </div>

              {/* Download Button */}
              <button
                onClick={(e) => handleDownload(e, icon)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
                title="Download"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </Link>
          ))}
        </div>

        {/* Loading Indicator */}
        {visibleItems < filteredIcons.length && (
          <div ref={loadingRef} className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No Results */}
        {filteredIcons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No icons found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
