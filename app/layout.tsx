import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ReactQuearyProvider } from "./utils/queryProvider";
import { Toaster } from "sonner"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (cookies().get("token")?.value == "") {
    redirect("/dashboard")
  }
  return (
    <html lang="en">
      <ReactQuearyProvider>
        <Toaster richColors duration={2000} />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </ReactQuearyProvider>
    </html>
  );
}
