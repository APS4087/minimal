import type { Metadata } from "next";
import { courier } from "@/fonts/Courier";
import { neuemontreal } from "@/fonts/NeueMontreal";
import "@/style/globals.scss";
import { LenisWrapper, Grid, GsapScrollTrigger, MenuWrapper } from "@/ui/components";
import { ThemeProvider } from "@/lib/theme";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');})();` }} />
      </head>
      <body
        className={`${courier.variable} ${neuemontreal.variable} font-serif text-black dark:text-white antialiased bg-white dark:bg-[#0a0a0a]`}
      >
        <ThemeProvider>
          <MenuWrapper />
          <main id="content" tabIndex={-1} className="pt-40">
            {children}
          </main>
          <Grid />
          <GsapScrollTrigger />
          <LenisWrapper />
        </ThemeProvider>
      </body>
    </html>
  );
}
