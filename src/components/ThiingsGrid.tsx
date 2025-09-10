"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Download, X } from "lucide-react";
import { ThiingsIcon } from "@/types";

interface ThiingsGridProps {
  icons: ThiingsIcon[];
}

const ITEMS_PER_PAGE = 50;

// Category mappings based on the modal screenshot
const CATEGORY_MAPPINGS = {
  "Everyday Life": ["everyday life", "daily", "routine"],
  Events: ["events", "celebration", "party", "wedding", "festival"],
  Animals: ["animals", "wildlife", "pets", "zoo"],
  Sports: ["sports", "fitness", "exercise", "gym", "game"],
  Countries: ["countries", "nation", "flag", "geography"],
  Professions: ["professions", "jobs", "career", "work"],
  Hobbies: ["hobbies", "craft", "art", "leisure"],
  "Nature & Outdoors": ["nature", "outdoors", "environment", "plants", "trees"],
  "Places & Structures": ["places", "structures", "buildings", "architecture"],
  "Technology & Media": ["technology", "media", "tech", "digital", "computer"],
  "Vehicles & Transport": ["vehicles", "transport", "car", "truck", "plane"],
  "Entertainment & Leisure": ["entertainment", "leisure", "fun", "music"],
  "Food & Drink": ["food", "drink", "cuisine", "cooking", "kitchen"],
  "Work & Industry": [
    "work",
    "industry",
    "business",
    "office",
    "manufacturing",
  ],
  "Space & Science": ["space", "science", "astronomy", "research"],
  "Interface & Symbols": ["interface", "symbols", "icons", "ui", "signs"],
  "Health & Wellness": ["health", "wellness", "medical", "medicine"],
  "Fashion & Style": ["fashion", "style", "clothing", "accessories"],
  "History & Culture": ["history", "culture", "heritage", "tradition"],
  "Fantasy & Imagination": ["fantasy", "imagination", "magical", "mythical"],
  Flags: ["flags", "banner", "national"],
  "Historical Figures": ["historical", "figures", "people", "famous"],
  Sponsors: ["sponsors", "brand", "logo", "company"],
};

export default function ThiingsGrid({ icons }: ThiingsGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Get organized categories with counts
  const organizedCategories = useMemo(() => {
    const categoryCount = new Map<string, number>();
    icons.forEach((icon) => {
      icon.categories.forEach((category) => {
        const cleanCategory = category.trim();
        if (cleanCategory) {
          categoryCount.set(
            cleanCategory,
            (categoryCount.get(cleanCategory) || 0) + 1
          );
        }
      });
    });

    // Organize categories into sections
    const organized: { [key: string]: Array<{ name: string; count: number }> } =
      {};

    Object.entries(CATEGORY_MAPPINGS).forEach(([section, keywords]) => {
      organized[section] = [];
      Array.from(categoryCount.entries()).forEach(([category, count]) => {
        const categoryLower = category.toLowerCase();
        if (
          keywords.some(
            (keyword) =>
              categoryLower.includes(keyword) || keyword.includes(categoryLower)
          )
        ) {
          organized[section].push({ name: category, count });
        }
      });
      // Sort by count within each section
      organized[section].sort((a, b) => b.count - a.count);
    });

    return organized;
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
      const isSelected = prev.some(
        (cat) => cat.toLowerCase() === category.toLowerCase()
      );
      if (isSelected) {
        const newCategories = prev.filter(
          (cat) => cat.toLowerCase() !== category.toLowerCase()
        );
        // Update search term to reflect active filters
        setSearchTerm(newCategories.join(", "));
        return newCategories;
      } else {
        const newCategories = [...prev, category];
        // Update search term to reflect active filters
        setSearchTerm(newCategories.join(", "));
        return newCategories;
      }
    });
  }, []);

  // Handle quick category selection
  const handleQuickCategory = useCallback(
    (categoryType: string) => {
      if (categoryType === "all") {
        setSelectedCategories([]);
        setSearchTerm("");
        return;
      }

      // Find matching categories for quick filters
      const matchingCategories: string[] = [];
      Object.entries(organizedCategories).forEach(([section, categories]) => {
        if (
          section.toLowerCase().includes(categoryType) ||
          categoryType === "latest" ||
          categoryType === "sponsors"
        ) {
          categories.forEach((cat) => matchingCategories.push(cat.name));
        }
      });

      if (categoryType === "animals") {
        matchingCategories.push(
          ...icons
            .flatMap((icon) => icon.categories)
            .filter((cat) => cat.toLowerCase().includes("animal"))
            .filter((cat, index, arr) => arr.indexOf(cat) === index)
        );
      }

      if (categoryType === "vehicles") {
        matchingCategories.push(
          ...icons
            .flatMap((icon) => icon.categories)
            .filter(
              (cat) =>
                cat.toLowerCase().includes("vehicle") ||
                cat.toLowerCase().includes("transport")
            )
            .filter((cat, index, arr) => arr.indexOf(cat) === index)
        );
      }

      const uniqueCategories = [...new Set(matchingCategories)].slice(0, 5);
      setSelectedCategories(uniqueCategories);
      setSearchTerm(uniqueCategories.join(", "));
    },
    [organizedCategories, icons]
  );

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
      { threshold: 0.1 }
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
    async (e: React.MouseEvent, icon: ThiingsIcon) => {
      e.preventDefault();
      e.stopPropagation();

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
    },
    []
  );

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center mb-6">
              {/* Search Bar */}
              <div className="max-w-lg mx-auto mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search 7000 Things"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-transparent shadow-lg placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategories([]);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap justify-center gap-3 mb-4">
                <button
                  onClick={() => handleQuickCategory("all")}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${
                    selectedCategories.length === 0
                      ? "bg-orange-500 text-white shadow-orange-500/30"
                      : "bg-white/90 text-gray-700 hover:bg-orange-100 border border-gray-200/50"
                  }`}
                >
                  all
                </button>

                <button
                  onClick={() => handleQuickCategory("latest")}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${
                    selectedCategories.some((cat) =>
                      cat.toLowerCase().includes("latest")
                    )
                      ? "bg-yellow-500 text-white shadow-yellow-500/30"
                      : "bg-white/90 text-gray-700 hover:bg-yellow-100 border border-gray-200/50"
                  }`}
                >
                  latest
                </button>

                <button
                  onClick={() => handleQuickCategory("animals")}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${
                    selectedCategories.some((cat) =>
                      cat.toLowerCase().includes("animal")
                    )
                      ? "bg-green-500 text-white shadow-green-500/30"
                      : "bg-white/90 text-gray-700 hover:bg-green-100 border border-gray-200/50"
                  }`}
                >
                  animals
                </button>

                <button
                  onClick={() => handleQuickCategory("vehicles")}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${
                    selectedCategories.some(
                      (cat) =>
                        cat.toLowerCase().includes("vehicle") ||
                        cat.toLowerCase().includes("transport")
                    )
                      ? "bg-blue-500 text-white shadow-blue-500/30"
                      : "bg-white/90 text-gray-700 hover:bg-blue-100 border border-gray-200/50"
                  }`}
                >
                  vehicles
                </button>

                <button
                  onClick={() => handleQuickCategory("sponsors")}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm ${
                    selectedCategories.some((cat) =>
                      cat.toLowerCase().includes("sponsor")
                    )
                      ? "bg-purple-500 text-white shadow-purple-500/30"
                      : "bg-white/90 text-gray-700 hover:bg-purple-100 border border-gray-200/50"
                  }`}
                >
                  sponsors
                </button>

                <button
                  onClick={() => setShowCategoriesModal(true)}
                  className="px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm bg-white/90 text-gray-700 hover:bg-gray-100 border border-gray-200/50"
                >
                  more
                </button>
              </div>

              {/* Results Count */}
              <p className="text-gray-600 text-sm">
                {filteredIcons.length} icons
                {searchTerm &&
                  selectedCategories.length === 0 &&
                  ` found for "${searchTerm}"`}
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Icons Grid */}
          <div
            ref={containerRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6"
          >
            {visibleIcons.map((icon) => (
              <Link
                key={icon.id}
                href={`/icon/${icon.id}`}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 hover:border-white/80 hover:shadow-xl transition-all duration-300 p-6 aspect-square flex flex-col items-center justify-center shadow-lg"
              >
                {/* Icon Image */}
                <div className="relative w-20 h-20 mb-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={icon.imageUrlGrid || icon.imageUrl}
                    alt={icon.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Icon Name */}
                <h3 className="text-sm font-medium text-gray-900 text-center line-clamp-2 leading-tight">
                  {icon.name}
                </h3>

                {/* Download Button */}
                <button
                  onClick={(e) => handleDownload(e, icon)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                  title={`Download ${icon.name}`}
                >
                  <Download className="w-4 h-4 text-gray-600" />
                </button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              </Link>
            ))}
          </div>

          {/* Loading Indicator */}
          {visibleItems < filteredIcons.length && (
            <div ref={loadingRef} className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                <span className="text-gray-600 text-sm">
                  Loading more icons...
                </span>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          {visibleItems >= filteredIcons.length && filteredIcons.length > 0 && (
            <div className="mt-16 text-center">
              <div className="inline-flex space-x-4">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full hover:bg-white transition-all duration-200 shadow-lg border border-white/50 font-medium"
                >
                  discover more
                </button>
                <button
                  onClick={() => {
                    console.log("Download all functionality");
                  }}
                  className="px-8 py-4 bg-gray-800/90 backdrop-blur-sm text-white rounded-full hover:bg-gray-900 transition-all duration-200 shadow-lg font-medium"
                >
                  download all
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredIcons.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/50 max-w-md mx-auto">
                <div className="text-gray-400 mb-6">
                  <Search className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">
                  No icons found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or browse different categories
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Show all icons
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-white/20 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                All Categories
              </h2>
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(organizedCategories).map(
                  ([section, categories]) =>
                    categories.length > 0 && (
                      <div key={section} className="space-y-3">
                        <h3 className="font-medium text-gray-900 text-lg">
                          {section}
                        </h3>
                        <div className="space-y-2">
                          {categories.slice(0, 8).map((category) => (
                            <button
                              key={category.name}
                              onClick={() => {
                                toggleCategory(category.name);
                                setShowCategoriesModal(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                                selectedCategories.some(
                                  (cat) =>
                                    cat.toLowerCase() ===
                                    category.name.toLowerCase()
                                )
                                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                  : "bg-gray-50/80 text-gray-700 hover:bg-gray-100 border border-gray-200/50"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {category.name}
                                </span>
                                <span className="text-xs opacity-75">
                                  {category.count}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
