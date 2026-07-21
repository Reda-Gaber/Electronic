---
name: Silicon Horizon
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#46566c'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6e85'
  on-tertiary-container: '#e9f0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.01em
  mono-spec:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style

The design system is engineered for a premium high-performance hardware marketplace. It blends the clinical precision of a modern tech laboratory with the approachable elegance of high-end consumer electronics. The target audience consists of enthusiasts, professionals, and gamers who value technical specifications as much as aesthetic sophistication.

The style is a fusion of **Corporate Modern** and **Glassmorphism**. It utilizes expansive white space to denote luxury and "breathing room" for complex product data. Visual interest is generated through depth—using frosted glass overlays and soft, multi-layered shadows—rather than heavy color application. The emotional response should be one of absolute trust, technological superiority, and effortless navigation.

## Colors

The palette is intentionally restrained to keep the focus on high-fidelity product imagery. 

- **Primary Blue (#2563EB):** Used exclusively for high-intent actions, progress indicators, and subtle accents. It represents reliability and precision.
- **Neutral/Surface (#F8FAFC):** This soft slate serves as the secondary background color to create subtle contrast against the pure white (#FFFFFF) primary surfaces.
- **Text & Contrast:** The secondary color (#0F172A) provides deep contrast for headlines, ensuring maximum readability for technical specs.
- **Glass Effects:** Use semi-transparent white layers with a 20px background blur for floating navigation bars and modal overlays to maintain a sense of depth and lightness.

## Typography

The typography strategy prioritizes clarity and a "tech-first" aesthetic. **Be Vietnam Pro** is selected for its contemporary, geometric construction which translates beautifully into an Arabic context when paired with a compatible Arabic typeface like *IBM Plex Sans Arabic* for system fallbacks.

- **Scale:** Use a generous typographic scale. Large display headers should be used for product categories, while body text remains clean and airy.
- **Alignment:** As an Arabic-first system, the default alignment is Right-to-Left (RTL). Ensure that numerical data (prices, technical specs) remains legible and properly spaced within RTL blocks.
- **Technical Specs:** Use a secondary monospaced font (Geist) at small sizes for serial numbers or raw technical data to emphasize the "engineering" aspect of the hardware.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Breathing Room:** We employ a "Micro/Macro" spacing philosophy. Macro spacing (between sections) is aggressive (80px+) to distinguish product categories, while micro spacing (within cards) is tight and disciplined.
- **Rhythm:** All spacing is derived from a 4px base unit. 
- **Product Grids:** Components like GPU or Motherboard listings should use a 24px gutter to ensure that even with large 20px rounded corners, the cards do not feel crowded.
- **Mobile Reflow:** On mobile, side-bar filters transition into a bottom-sheet glassmorphic drawer to maximize screen real estate for product browsing.

## Elevation & Depth

Depth is the primary driver of hierarchy in this design system. We avoid heavy borders in favor of layered elevations.

- **Level 0 (Base):** #F8FAFC background.
- **Level 1 (Cards):** #FFFFFF surface with a 1px soft stroke (#E2E8F0) and a very diffuse shadow: `0 4px 20px rgba(0, 0, 0, 0.03)`.
- **Level 2 (Hover/Active):** Increased shadow depth: `0 20px 40px rgba(0, 0, 0, 0.08)`.
- **Glass Layers:** Floating elements (like the navigation bar or "Add to Cart" sticky bar) use a white background at 70% opacity with a `backdrop-filter: blur(20px)`. This creates a sense of the interface existing "above" the hardware components.

## Shapes

The shape language is defined by oversized, friendly, yet professional radii. 

- **Primary Radius:** 20px is the standard for product cards, image containers, and main UI blocks. This softens the "industrial" feel of computer hardware, making the tech feel more consumer-friendly.
- **Buttons:** Use slightly smaller 12px radii for primary buttons to give them a distinct, more "clickable" look compared to the containers they sit in.
- **Interactive States:** On hover, cards should subtly scale (1.02x) while maintaining their 20px corner radius to reinforce the tactile nature of the UI.

## Components

### Buttons
- **Primary:** Solid #2563EB with white text. 12px corner radius. No shadow on rest, soft blue glow shadow on hover.
- **Secondary:** Transparent background with #2563EB border (1.5px) and text.
- **Glass Action:** 10% white overlay with high blur for secondary actions on image-heavy backgrounds.

### Product Cards
The central component of the system.
- Background: #FFFFFF.
- Corner Radius: 20px.
- Image Area: Soft #F8FAFC inner container to frame hardware photos.
- Content: Right-aligned text (Arabic), clear price in bold primary color, and a "Quick View" glassmorphism button appearing on hover.

### Form Inputs
- Background: #F8FAFC.
- Border: 1px transparent.
- Active State: Border turns #2563EB with a soft blue 4px outer glow (focus ring).

### Spec Chips
Small, 8px rounded capsules used for technical tags (e.g., "RTX 4090", "DDR5"). Use #F1F5F9 backgrounds with #475569 text to keep them subordinate to the primary product title.

### Navigation Bar
A sticky, glassmorphic top bar. Height 80px. Contains the logo (right), search bar (center - soft rounded 100px), and user actions (left).