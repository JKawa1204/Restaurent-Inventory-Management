import { Link } from "react-router-dom";


export const Inappbar = ({ buttonText }) => {
  return (
    <div className="navbar bg-gray-200 h-20 flex items-center justify-between px-6 shadow-md">
      <Link to="/dashboard" className="text-2xl text-black font-bold">{buttonText}</Link>
  
      
    </div>
  );
};