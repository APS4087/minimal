import type { Metadata } from "next";
import { courier } from "@/fonts/Courier";
import "@/style/globals.scss";
import { Lenis, Grid, GsapScrollTrigger, Menu } from "@/ui/components";

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
        className={`${courier.variable} ${courier.variable} font-serif text-white antialiased bg-black`}
      >
        <Menu />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <Grid />
        <GsapScrollTrigger />
        <Lenis key={`lenis${(children as React.ReactElement)?.key}`} />
      </body>
    </html>
  );
}
