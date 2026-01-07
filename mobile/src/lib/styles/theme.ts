export type SystemTheme = "light" | "dark";

export interface Theme {
  mode: SystemTheme;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    disabled: string;
    text: {
      primary: string;
      secondary: string;
      inverse: string;
    };
    border: {
      primary: string;
      secondary: string;
    };
  };
  fonts: {
    family: {
      body: string;
      heading: string;
      monospace: string;
    };
    size: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    weights: {
      light: number;
      regular: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    background: "#ffffff",
    foreground: "#000000",
    primary: "#000000",
    secondary: "#000000",
    disabled: "#d1d1d1",
    text: {
      primary: "#000000",
      secondary: "#d1d1d1",
      inverse: "#ffffff",
    },
    border: {
      primary: "#000000",
      secondary: "#d1d1d1",
    },
  },
  fonts: {
    family: {
      body: "System",
      heading: "System",
      monospace: "System",
    },
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  mode: "dark",
  colors: {
    background: "#111315",
    foreground: "#ffffff",
    primary: "#ffffff",
    secondary: "#ffffff",
    disabled: "#414141",
    text: {
      primary: "#ffffff",
      secondary: "#ffffff",
      inverse: "#000000",
    },
    border: {
      primary: "#414141",
      secondary: "#414141",
    },
  },
};
