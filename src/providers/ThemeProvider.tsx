
import { ThemeProvider as ThemeProviderComponent } from "@/components/theme-provider";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <ThemeProviderComponent>{children}</ThemeProviderComponent>;
}
