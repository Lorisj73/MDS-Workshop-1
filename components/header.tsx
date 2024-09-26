"use client";
import { Button } from "@/components/ui/button";
import { Building2, Home, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center p-3">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Xlinks</span>
        </Link>
        <nav className="flex space-x-4 mx-auto flex-grow justify-center">
          <Link
            href="/"
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              pathname === "/"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Home className="mr-3 h-6 w-6" />
            Home
          </Link>
          <Link
            href="/acquereur"
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              pathname === "/acquereur"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Users className="mr-3 h-6 w-6" />
            Acquéreur
          </Link>
          <Link
            href="/cedant"
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
              pathname === "/cedant"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Building2 className="mr-3 h-6 w-6" />
            Cédant
          </Link>
        </nav>
      </div>
    </header>
  );
}
