---
name: Silicon Horizon Redux
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#e4beba'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#302f38'
  outline: '#ab8986'
  outline-variant: '#5b403e'
  surface-tint: '#ffb3ad'
  primary: '#ffb3ad'
  on-primary: '#68000a'
  primary-container: '#ff5451'
  on-primary-container: '#5c0008'
  inverse-primary: '#b91a24'
  secondary: '#c6c4da'
  on-secondary: '#2f2f40'
  secondary-container: '#464557'
  on-secondary-container: '#b5b3c8'
  tertiary: '#ffb3b2'
  on-tertiary: '#561e20'
  tertiary-container: '#ca7b7b'
  on-tertiary-container: '#4d171a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#930013'
  secondary-fixed: '#e3e0f7'
  secondary-fixed-dim: '#c6c4da'
  on-secondary-fixed: '#1a1a2a'
  on-secondary-fixed-variant: '#464557'
  tertiary-fixed: '#ffdad9'
  tertiary-fixed-dim: '#ffb3b2'
  on-tertiary-fixed: '#3a090d'
  on-tertiary-fixed-variant: '#723335'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  headline-xl:
    fontFamily: Be Vietnam Pro
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Be Vietnam Pro
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system embodies a high-octane, premium dark-tech aesthetic. It is engineered for high-performance environments where speed, precision, and sophistication are paramount. The brand personality is aggressive yet controlled, blending the raw energy of high-tech hardware with the polished finish of luxury software.

The style is a fusion of **Minimalism** and **Glassmorphism**, set against a deep, multi-layered dark background. It utilizes high-contrast accents of vibrant red to guide the eye toward critical actions and data points. The interface feels like a high-end command center—engineered, purposeful, and cutting-edge.

## Colors
The palette is anchored by a vibrant, "High-Tech Red" (#EF4444) that serves as the primary signal color. This red is designed to pop against a "Deep Space" neutral background. 

- **Primary:** Used for main actions, active states, and critical branding.
- **Primary-Container:** A deep, desaturated red used for subtle card backgrounds or muted selections.
- **Secondary:** A cool-toned dark navy/charcoal used for structural containers to provide depth.
- **Surface Strategy:** Surfaces use a tiered dark approach (Base: #0F0F17, Raised: #1E1E2E) to create visual hierarchy without relying on heavy borders.

## Typography
The system exclusively uses **Be Vietnam Pro** to maintain a contemporary, friendly, yet professional feel. 

- **Headlines:** Use Bold (700) weights with slightly tighter letter-spacing to give a "locked-in" technical appearance.
- **Body:** Standardized at 16px for optimal legibility against dark backgrounds.
- **Labels:** Uppercase application is encouraged for small labels to enhance the "UI/Dashboard" aesthetic.
- **Contrast:** Ensure all text on surfaces meets WCAG 2.1 AA standards; use `on-surface` for primary text and a 60% opacity variant for secondary descriptions.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on an 8px base unit. 

- **Desktop:** 12-column grid with 24px gutters and 40px side margins.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

Use "md" (24px) spacing for internal card padding and "sm" (12px) for grouping related elements like input fields and their labels. High-tech layouts benefit from generous whitespace ("lg" and "xl") between major sections to prevent information density fatigue.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Glassmorphism**. 

1. **Level 0 (Base):** #0F0F17.
2. **Level 1 (Cards/Panels):** #1E1E2E with a subtle 1px stroke (Color: #334155).
3. **Level 2 (Modals/Popovers):** Semi-transparent #1E1E2E with a 20px Backdrop Blur and a light "top-down" inner glow to simulate a glass edge.

Shadows are used sparingly. When applied, use a deep, large-radius ambient shadow (#000000, 40% opacity) with a slight red tint in the glow when the element is associated with a primary action.

## Shapes
The system utilizes a "Rounded" (0.5rem) base aesthetic. This softens the aggressive high-tech look, making the software feel modern and accessible rather than purely industrial.

- **Standard Buttons & Inputs:** 0.5rem (8px).
- **Cards & Large Containers:** 1rem (16px).
- **System Tags/Chips:** 1.5rem (24px) for a "Pill" look that differentiates them from structural blocks.

## Components
- **Buttons:** Primary buttons use the vibrant Red (#EF4444) with white text. Secondary buttons are ghost-style with a #334155 border and white text.
- **Inputs:** Dark backgrounds (#0F0F17) with a subtle outline that turns Red (#EF4444) on focus.
- **Chips:** Small, pill-shaped indicators. Active state uses `primary-container` with `on-primary-container` text.
- **Cards:** Use #1E1E2E background. For interactive cards, add a 2px Red bottom border on hover.
- **Lists:** Separated by thin, low-opacity lines (#334155). 
- **Checkboxes/Radios:** When selected, they should be filled with the primary Red.
- **Status Indicators:** Red is reserved for "Primary Action" and "Critical Error." Use high-contrast ambers for warnings and emerald for success to complement the red-heavy theme.