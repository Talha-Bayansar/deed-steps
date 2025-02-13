"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

const Header = () => {
  const t = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800">
      <div className="px-4 py-6 lg:px-6 flex items-center">
        <div className="flex items-center justify-between w-full">
          <Link className="flex items-center justify-center" href="#">
            <Image
              src="/placeholder.svg?height=32&width=32"
              width={32}
              height={32}
              alt={t("logoAlt", { appName: APP_NAME })}
              className="rounded-lg"
            />
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Deed Steps
            </span>
          </Link>
          <nav className="hidden sm:ml-auto sm:flex sm:gap-6">
            <Link
              className="text-sm font-medium hover:text-purple-600 transition-colors"
              href="#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:text-purple-600 transition-colors"
              href="#pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:text-purple-600 transition-colors"
              href="#install"
            >
              Install
            </Link>
            <Link
              className="text-sm font-medium hover:text-purple-600 transition-colors"
              href="#faq"
            >
              FAQ
            </Link>
          </nav>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <nav className="pt-2 pb-3 space-y-1">
            <Link
              href="#features"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              Pricing
            </Link>
            <Link
              href="#cta"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
