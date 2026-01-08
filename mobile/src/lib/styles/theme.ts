import { TextStyle } from "react-native";

import { palette } from "./palette";

type FontWeight = TextStyle["fontWeight"];

export type SystemTheme = "light" | "dark";

export interface Theme {
  mode: SystemTheme;
  colors: {
    background: {
      app: string;
      surface: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
      subtle: string;
    };
    border: {
      subtle: string;
      default: string;
    };
    status: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
    action: {
      primary: string;
      secondary: string;
      destructive: string;
      disabled: string;
      link: string;
      inverse: string;
      success: string;
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
      light: FontWeight;
      regular: FontWeight;
      medium: FontWeight;
      semibold: FontWeight;
      bold: FontWeight;
    };
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  heights: {
    sm: number;
    md: number;
    lg: number;
  };
}

export const lightTheme: Theme = {
  mode: "light",
  colors: {
    background: {
      app: palette.neutral[50],
      surface: palette.neutral[100],
    },
    text: {
      primary: palette.neutral[900],
      secondary: palette.neutral[700],
      disabled: palette.neutral[700],
      inverse: palette.neutral[50],
      subtle: palette.neutral[400],
    },
    border: {
      subtle: palette.neutral[200],
      default: palette.neutral[900],
    },
    status: {
      success: palette.green[500],
      error: palette.red[500],
      warning: palette.yellow[500],
      info: palette.neutral[900],
    },
    action: {
      primary: palette.neutral[900],
      secondary: palette.neutral[700],
      destructive: palette.red[500],
      disabled: palette.neutral[700],
      link: palette.blue[500],
      inverse: palette.neutral[900],
      success: palette.green[500],
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
      light: "300",
      regular: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 56,
  },
  heights: {
    sm: 30,
    md: 40,
    lg: 48,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  mode: "dark",
  colors: {
    background: {
      app: palette.neutral[900],
      surface: palette.neutral[800],
    },
    text: {
      primary: palette.neutral[50],
      secondary: palette.neutral[700],
      disabled: palette.neutral[700],
      inverse: palette.neutral[900],
      subtle: palette.neutral[600],
    },
    border: {
      subtle: palette.neutral[700],
      default: palette.neutral[50],
    },
    status: {
      success: palette.green[500],
      error: palette.red[500],
      warning: palette.yellow[500],
      info: palette.neutral[900],
    },
    action: {
      primary: palette.neutral[50],
      secondary: palette.neutral[700],
      destructive: palette.red[500],
      disabled: palette.neutral[700],
      link: palette.blue[500],
      inverse: palette.neutral[50],
      success: palette.green[500],
    },
  },
};
