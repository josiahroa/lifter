import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";

import {
  lightTheme,
  darkTheme,
  type SystemTheme,
  type Theme,
} from "@/lib/theme";

export type ThemeMode = SystemTheme | "system";

export interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const systemColorScheme = useColorScheme();

  let currentTheme: Theme;
  if (themeMode === "system") {
    currentTheme = systemColorScheme === "dark" ? darkTheme : lightTheme;
  } else {
    currentTheme = themeMode === "dark" ? darkTheme : lightTheme;
  }

  console.log("ThemeProvider: theme is", systemColorScheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem("theme-mode");
        const mode = (stored as ThemeMode) || "system";

        setThemeModeState(mode);
      } catch (error) {
        console.error("Failed to load theme preference", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (themeMode === "system") {
      Appearance.setColorScheme(null);
    } else {
      Appearance.setColorScheme(themeMode);
    }
  }, [themeMode]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem("theme-mode", mode);
    } catch (error) {
      console.error("Failed to save theme preference", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, themeMode, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
