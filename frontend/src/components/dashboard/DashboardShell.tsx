"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dna, FlaskConical, Microscope, Bot, GraduationCap, MapPin,
  User, LogOut, Menu, X, ChevronLeft,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockAuth } from "@/lib/supabase/client";

const sidebarLinks = [
  { icon: FlaskConical, label: "Prediction Lab", href: "/dashboard" },
  { icon: Microscope, label: "ChromoLens", href: "/dashboard/chromolens" },
  { icon: Bot, label: "GenoGuide", href: "/dashboard/genoguide" },
  { icon: GraduationCap, label: "Gene Academy", href: "/dashboard/academy" },
  { icon: MapPin, label: "Heritage Mapper", href: "/dashboard/heritage" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = mockAuth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUserName(user.full_name || "User");
  }, [router]);

  const handleLogout = () => {
    mockAuth.removeUser();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-16 shrink-0 border-b border-sidebar-border">
        <Dna className="h-7 w-7 text-gene-emerald shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold whitespace-nowrap overflow-hidden"
            >
              <span className="text-foreground">Geno</span>
              <span className="text-gene-emerald">Vault</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? "bg-gene-emerald/10 text-gene-emerald"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gene-emerald rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <link.icon className={`h-5 w-5 shrink-0 ${active ? "text-gene-emerald" : "group-hover:text-gene-emerald/70"}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button (desktop) */}
      <div className="hidden lg:block px-3 py-3 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all w-full"
        >
          <ChevronLeft className={`h-5 w-5 shrink-0 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border shrink-0"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[256px] bg-sidebar border-r border-sidebar-border z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-medium text-muted-foreground">
                {sidebarLinks.find((l) => isActive(l.href))?.label || "Dashboard"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted/50">
                    <Avatar className="h-8 w-8 border border-gene-emerald/20">
                      <AvatarFallback className="bg-gene-emerald/10 text-gene-emerald text-sm font-semibold">
                        {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium">{userName}</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-48 gene-glass">
                <DropdownMenuItem
                  render={
                    <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> My Profile
                    </Link>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
