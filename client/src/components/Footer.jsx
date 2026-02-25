import React from "react";

const Footer = () => (
    <footer className="border-t border-white/5 py-6 px-6 md:px-14 mt-10">
        <div className="flex items-center justify-between text-gray-600 text-xs">
            <span className="text-[#e50914] font-black text-base tracking-tight">MOVIEFLIX</span>
            <span>© {new Date().getFullYear()} MovieFlix. All rights reserved.</span>
        </div>
    </footer>
);

export default Footer;
