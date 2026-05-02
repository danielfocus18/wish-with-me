import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wish With Me — Beautiful Digital Greeting Cards",
  description:
    "Create and share stunning animated digital greeting cards for birthdays, graduations, Valentine's Day, and every special moment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Pacifico&family=Playfair+Display:wght@400;600;700&family=Dancing+Script:wght@400;600;700&family=Merriweather:wght@400;700&family=Oswald:wght@400;600&family=Raleway:wght@400;600;700&family=Mountains+of+Christmas:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
