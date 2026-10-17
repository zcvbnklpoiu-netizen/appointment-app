import type { Metadata } from "next";
import "./globals.css";
import "./_component/motion.css";
import Header from "./_component/Header";
import Footer from "./_component/Footer";

export const metadata: Metadata = {
  title: "MediaBook | Explore care options",
  description: "Explore clinician profiles, specialties, and appointment options with MediaBook.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
