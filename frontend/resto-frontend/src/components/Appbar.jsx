import { useState } from "react";

export const Appbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
 

  const handleSignout = () => {
    // Navigate to the signup page
  };

  return (
    <div className="navbar bg-gray-200 h-20 flex items-center justify-between px-6 shadow-md">
      <a className="text-2xl text-black font-bold">Welcome to my Restaurent Inventory Management</a>
      <div className="relative">
        <button className="btn btn-square btn-ghost text-black" onClick={() => setShowDropdown(!showDropdown)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button onClick={handleSignout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Sign out</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
