import ThiingsGrid from "@/components/ThiingsGrid";
import { ThiingsIcon } from "@/types";
import thiingsData from "@/data/thiings_metadata_7000.json";

export default function Home() {
  const icons: ThiingsIcon[] = thiingsData;

  return <ThiingsGrid icons={icons} />;
}
