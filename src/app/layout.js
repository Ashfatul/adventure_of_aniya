import { cn } from "@/lib/utils";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
  title: "Aniya's Adventure Diary",
  description: "Growing up so fast! Converting giggles into memories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        inter.variable, 
        playfair.variable, 
        "font-sans bg-background text-foreground antialiased selection:bg-yellow-200 selection:text-yellow-900"
      )}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
