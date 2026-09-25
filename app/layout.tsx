import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

// Loaded once. The app uses it through --font-sans (globals.css); a Theme
// that wants it points its own font variable at --font-open-sans.
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
