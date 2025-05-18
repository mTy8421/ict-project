export const theme = {
  // Main Colors
  primary: "#616166", // Mid Gray - Main color
  secondary: "#a1afd0", // Rock Blue - Secondary color
  accent: "#adaeb5", // Bombay - Accent color
  background: "#ebd1c3", // Almond - Background color

  // Text Colors
  text: "#616166", // Mid Gray for text
  textLight: "#adaeb5", // Bombay for secondary text
  white: "#ffffff",

  // Status Colors
  success: "#48bb78", // Green
  warning: "#ed8936", // Orange
  danger: "#e53e3e", // Red

  // Layout Colors
  headerBg: "#616166", // Mid Gray for header
  // sidebarBg: '#a1afd0', // Rock Blue for sidebar
  sidebarBg: "#8672ff", // Rock Blue for sidebar
  // sidebarHover: "#adaeb5", // Bombay for hover
  sidebarHover: "#6347ff", // Bombay for hover
  sidebarActive: "#616166", // Mid Gray for active
  cardBg: "#ffffff",

  // Shadows
  shadow: "0 2px 8px rgba(0,0,0,0.1)",
  shadowLarge: "0 4px 12px rgba(0,0,0,0.15)",

  // Spacing
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },

  // Border Radius
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
  },

  // Font Sizes
  fontSize: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    xxl: "24px",
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Transitions
  transition: {
    default: "all 0.3s ease",
    fast: "all 0.15s ease",
    slow: "all 0.5s ease",
  },

  // Z-index
  zIndex: {
    header: 1000,
    sidebar: 900,
    modal: 1100,
    dropdown: 1000,
  },
} as const;

// Type for the theme
export type Theme = typeof theme;

// Export default theme
export default theme;
