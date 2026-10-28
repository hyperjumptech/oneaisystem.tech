// app/fonts.ts
import localFont from "next/font/local";

export const figtree = localFont({
  src: "./Figtree-Regular.ttf",
  variable: "--font-figtree",
  weight: "100 900"
});

export const switzer = localFont({
  src: "./Switzer-Variable.ttf",
  variable: "--font-switzer",
  weight: "100 900"
});

export const geistSans = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});
export const geistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});
