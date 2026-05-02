"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, PlusCircle, LogOut, Gift, Menu, X,
} from "lucide-react";
import { logoutAdmin } from "@/lib/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/create", label: "Create Card", icon: PlusCircle },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutAdmin();
    router.push("/admin");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen bg-white border-r border-gray-100 shadow-sm fixed left-0 top-0 z-40">
        <div className="p-5 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600 rounded-xl">
              <Gift size={18} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm block leading-tight">Wish With Me</span>
              <span className="text-xs text-gray-400">Admin Studio</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <div className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${pathname === href
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
                }
              `}>
                <Icon size={17} />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all duration-200"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-600 rounded-lg">
              <Gift size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Wish With Me</span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-violet-600 rounded-xl">
                    <Gift size={18} className="text-white" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-sm block">Wish With Me</span>
                    <span className="text-xs text-gray-400">Admin Studio</span>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                    <div className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                      ${pathname === href ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-100"}
                    `}>
                      <Icon size={18} />
                      {label}
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
