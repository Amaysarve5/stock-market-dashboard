import React from "react";
import {
  Home,
  LineChart,
  Layers,
  BarChart,
  Users,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-screen w-16 bg-gray-900 flex flex-col items-center py-6 space-y-6">
      {/* Top Section */}
      <Home className="text-gray-400 hover:text-white cursor-pointer" size={24} />
      <LineChart className="text-gray-400 hover:text-white cursor-pointer" size={24} />
      <Layers className="text-gray-400 hover:text-white cursor-pointer" size={24} />
      <BarChart className="text-gray-400 hover:text-white cursor-pointer" size={24} />
      <Users className="text-gray-400 hover:text-white cursor-pointer" size={24} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Section */}
      <Settings className="text-gray-400 hover:text-white cursor-pointer" size={24} />
    </div>
  );
};

export default Sidebar;
