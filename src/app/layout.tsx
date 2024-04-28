import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deen Steps",
  description: "Deen Steps",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-sans antialiased", inter.className)}>
        <div
          className="flex min-h-screen w-full overflow-x-hidden bg-background"
          vaul-drawer-wrapper=""
        >
          {children}
        </div>
      </body>
    </html>
  );
}
