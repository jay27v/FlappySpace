import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-purple-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold">
          Games
        </Link>
        <div className="space-x-4">
          <Link to="/page1" className="text-white hover:text-gray-300">
            Page 1
          </Link>
          <Link to="/page2" className="text-white hover:text-gray-300">
            Page 2
          </Link>
          <Link to="/page3" className="text-white hover:text-gray-300">
            Page 3
          </Link>
          <Link to="/page4" className="text-white hover:text-gray-300">
            Page 4
          </Link>
          <Link to="/page5" className="text-white hover:text-gray-300">
            Page 5
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
