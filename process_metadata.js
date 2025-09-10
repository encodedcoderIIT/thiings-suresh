import fs from "fs";

// Function to URL encode a string
function encodeURL(url) {
  return encodeURIComponent(url);
}

// Function to transform imageUrl to Next.js optimized URLs
function createOptimizedUrls(imageUrl) {
  const encodedUrl = encodeURL(imageUrl);
  const baseNextUrl = "https://www.thiings.co/_next/image?url=";

  return {
    imageUrlGrid: `${baseNextUrl}${encodedUrl}&w=320&q=75`,
    imageUrlPreview: `${baseNextUrl}${encodedUrl}&w=1000&q=75`,
  };
}

async function processMetadata() {
  const inputFile = "./src/data/thiings_metadata_7000_backup.json";
  const outputFile = "./src/data/thiings_metadata_7000.json";

  try {
    console.log("Reading the JSON file...");
    const jsonData = JSON.parse(fs.readFileSync(inputFile, "utf8"));

    console.log(`Processing ${jsonData.length} entries...`);

    // Process each entry
    const updatedData = jsonData.map((item, index) => {
      if (index % 1000 === 0) {
        console.log(`Processed ${index} entries...`);
      }

      // Create the optimized URLs
      const optimizedUrls = createOptimizedUrls(item.imageUrl);

      // Return the updated object with new fields
      return {
        ...item,
        imageUrlGrid: optimizedUrls.imageUrlGrid,
        imageUrlPreview: optimizedUrls.imageUrlPreview,
      };
    });

    console.log("Writing updated JSON file...");
    fs.writeFileSync(outputFile, JSON.stringify(updatedData, null, 2));

    console.log(`✅ Successfully processed ${updatedData.length} entries!`);
    console.log(`Updated file saved as: ${outputFile}`);

    // Show a sample of the first entry for verification
    console.log("\n📋 Sample of the first updated entry:");
    console.log(JSON.stringify(updatedData[0], null, 2));
  } catch (error) {
    console.error("❌ Error processing the file:", error);
  }
}

// Run the processing
processMetadata();
