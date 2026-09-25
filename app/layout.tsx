import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

// The app font, used through --font-sans (globals.css). Themes load their
// own fonts, so changing the app font never changes a Resume.
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Linted",
  description: "A local-first resume builder",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
