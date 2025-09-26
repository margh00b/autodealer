import BrowseByBody from "@/components/BrowseByBody/BrowseByBody";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Navbar from "@/components/Navbar/Navbar";
import SearchBar from "@/components/SearchBar/SearchBar";
import VehicleInventory from "@/components/VehicleInventory/VehicleInventory";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <SearchBar />
      <BrowseByBody />
      <div className=" flex flex-col items-center bg-teal-200 my-20 p-5">
        <div className="text-2xl text-center font-bold mb-10">
          <h1>INVENTORY</h1>
        </div>
        <VehicleInventory numberOfListings={6} />
      </div>
      <Footer />
    </div>
  );
}
