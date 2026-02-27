import React from "react";
import { Github, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full relative overflow-hidden bg-transparent border-t border-white/5 mt-20">
            {/* Subtle glow effect behind footer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#e50914]/40 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[50px] bg-[#e50914] blur-[100px] opacity-[0.07] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-14 py-12 flex flex-col items-center">

                {/* Brand */}
                <h2 className="text-2xl md:text-3xl font-[900] tracking-[-0.06em] leading-none text-[#e50914] mb-6 drop-shadow-[0_2px_12px_rgba(229,9,20,0.35)]">
                    MOVIEFLIX
                </h2>

                {/* Socials */}
                <div className="flex items-center gap-5 mb-8">
                    <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                        <Github size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                        <Instagram size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white hover:-translate-y-1 transition-all duration-300">
                        <Linkedin size={20} />
                    </a>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-500 mb-10 w-full max-w-2xl text-center">
                    <a href="#" className="hover:text-white transition-colors duration-200">Audio Description</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Help Center</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Gift Cards</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Media Center</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Investor Relations</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Jobs</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Terms of Use</a>
                    <a href="#" className="hover:text-white transition-colors duration-200">Privacy</a>
                </div>

                {/* Copyright & Made with love */}
                <div className="flex flex-col items-center gap-2 text-xs text-gray-600">
                    <p className="flex items-center gap-1.5">
                        Made with <Heart size={12} className="text-[#e50914] fill-[#e50914]" /> by Abhilash
                    </p>
                    <p>© {new Date().getFullYear()} MovieFlix. All data provided by TMDB.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
