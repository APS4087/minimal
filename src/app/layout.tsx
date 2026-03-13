import type { Metadata } from "next";
import { courier } from "@/fonts/Courier";
import { neuemontreal } from "@/fonts/NeueMontreal";
import "@/style/globals.scss";
import { LenisWrapper, Grid, GsapScrollTrigger, MenuWrapper } from "@/ui/components";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${courier.variable} ${neuemontreal.variable} font-serif text-black antialiased bg-white`}
      >
        <MenuWrapper />
        <main id="content" tabIndex={-1} className="pt-40">
          {children}
        </main>
        <Grid />
        <GsapScrollTrigger />
        <LenisWrapper />
      </body>
    </html>
  );
}
