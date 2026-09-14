import localFont from "next/font/local";

export const hseSans = localFont({
  src: [
    { path: "../fonts/HSE_Sans/HSESans-Thin.otf", weight: "100", style: "normal" },
    { path: "../fonts/HSE_Sans/HSESans-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/HSE_Sans/HSESans-Italic.otf", weight: "400", style: "italic" },
    { path: "../fonts/HSE_Sans/HSESans-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../fonts/HSE_Sans/HSESans-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/HSE_Sans/HSESans-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-hse-sans",
  display: "swap",
});
