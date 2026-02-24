import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aimaxauto — AI-Powered Car Ownership",
  description: "The smart way to manage, value, and trade your vehicles",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23FF6B00'/><text x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='white' font-weight='700' font-family='system-ui'>Ai</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
