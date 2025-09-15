import BrowseByBody from "@/components/BrowseByBody/BrowseByBody";
import Hero from "@/components/Hero/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />

      <BrowseByBody />
    </div>
  );
}
