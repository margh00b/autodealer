import Link from "next/link";
import { FaCarSide, FaDollarSign, FaUsers, FaHeadset } from "react-icons/fa";

export default function ViewInventory() {
  const features = [
    {
      title: "Wide Selection of Vehicles",
      description:
        "With a robust selection of popular vehicles on hand, as well as leading vehicles from BMW and Ford.",
      icon: <FaCarSide className="text-maroon w-6 h-6 mr-3" />,
    },
    {
      title: "Financing Made Easy",
      description:
        "Our stress-free finance department can find financial solutions to save you money.",
      icon: <FaDollarSign className="text-maroon w-6 h-6 mr-3" />,
    },
    {
      title: "Trusted By Thousands",
      description:
        "10 new offers every day. 350 offers on site, trusted by a community of thousands of users.",
      icon: <FaUsers className="text-maroon w-6 h-6 mr-3" />,
    },
    {
      title: "Customer Service",
      description:
        "Have a question for us? Send us a message! We are here to guide you through your next vehicle purchase.",
      icon: <FaHeadset className="text-maroon w-6 h-6 mr-3" />,
    },
  ];

  return (
    <section className="py-16 px-6 md:px-12 rounded-xl mx-auto w-full ">
      <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
        Explore Our Inventory
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            {/* Icon */}
            {feature.icon}

            {/* Text */}
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold text-gray-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/vehicles"
          className="inline-block bg-red text-white font-semibold rounded-lg shadow-md hover:bg-maroon transition-all px-6 py-3"
        >
          View All Vehicles
        </Link>
      </div>
    </section>
  );
}
