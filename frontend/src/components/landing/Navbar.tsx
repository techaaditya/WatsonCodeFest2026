"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dna } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-background/90 backdrop-blur-sm border-b border-beige" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Dna className="h-8 w-8 text-olive transition-transform duration-500 group-hover:rotate-180" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-olive">DNA</span>
              <span className="text-softgreen">Dristi</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate hover:text-olive transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-softgreen transition-all duration-300 group-hover:w-3/4 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-full border border-olive/25 bg-transparent px-6 font-medium text-olive backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-beige/40 hover:text-olive"
              >
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="rounded-full bg-gradient-to-b from-[#6b8554] to-olive px-7 font-medium text-cream shadow-[0_8px_30px_rgba(95,120,70,0.18),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:brightness-110 hover:shadow-[0_12px_40px_rgba(95,120,70,0.25)]">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate hover:text-olive transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background/95 backdrop-blur-sm border-t border-beige"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-slate hover:text-olive hover:bg-beige/30 rounded-2xl transition-all"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-beige">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center rounded-full border border-olive/25 bg-transparent px-6 font-medium text-olive backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-beige/40 hover:text-olive">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full justify-center rounded-full bg-gradient-to-b from-[#6b8554] to-olive px-7 font-medium text-cream shadow-[0_8px_30px_rgba(95,120,70,0.18),inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-[2px] hover:brightness-110 hover:shadow-[0_12px_40px_rgba(95,120,70,0.25)]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
