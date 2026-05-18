"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "首页" },
    { href: "/courses", label: "课程" },
    { href: "/upload", label: "自定义" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 tracking-tight">
          句会了
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-1 text-sm transition-colors ${
                pathname === link.href
                  ? "text-gray-900 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
