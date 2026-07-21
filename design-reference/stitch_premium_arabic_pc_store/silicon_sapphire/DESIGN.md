---
name: Silicon & Sapphire
colors:
  surface: '#fff8f7'
  surface-dim: '#f4d3ce'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e6'
  surface-container-high: '#ffe2dd'
  surface-container-highest: '#fddbd6'
  on-surface: '#291714'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#402b28'
  inverse-on-surface: '#ffedea'
  outline: '#926f6a'
  outline-variant: '#e7bdb7'
  surface-tint: '#c00011'
  primary: '#bb0010'
  on-primary: '#ffffff'
  primary-container: '#e41f22'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb4ab'
  secondary: '#ab332c'
  on-secondary: '#ffffff'
  secondary-container: '#ff7164'
  on-secondary-container: '#700408'
  tertiary: '#00628e'
  on-tertiary: '#ffffff'
  tertiary-container: '#007cb3'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000a'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb4ab'
  on-secondary-fixed: '#410002'
  on-secondary-fixed-variant: '#8a1b18'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#8bceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004b6f'
  background: '#fff8f7'
  on-background: '#291714'
  surface-variant: '#fddbd6'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Be Vietnam Pro
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.4'
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for a premium hardware retail experience that bridges the gap between high-performance gaming and professional workstation aesthetics. The brand personality is "Technical Elegance"—it communicates the power of PC components through a lens of sophisticated, minimalist luxury.

The style is a hybrid of **Minimalism** and **Glassmorphism**. It prioritizes extreme clarity, generous whitespace, and a high-end editorial feel reminiscent of premium consumer electronics brands. While the subject matter is hardware, the UI avoids "gamer" clichés like heavy dark modes or neon glows, opting instead for a warm, high-contrast environment where product photography is the hero. The emotional response should be one of absolute trust, precision, and excitement.

## Colors

This design system utilizes a high-contrast light palette with a distinct warm, technical character to ensure product specifications are legible and the interface feels authoritative.

- **Primary Red (#E82324):** A bold, high-energy red used for critical actions, price points, and active states. It signals performance and urgency.
- **Secondary Crimson (#CD4C42):** Used for supporting elements and tonal variations, grounding the primary red with a more sophisticated, muted warmth.
- **Tertiary Blue (#0081BA):** A technical blue used for secondary highlights, information callouts, and differentiating specialized product categories.
- **Surface Strategy:** The background uses a warm neutral palette. Surfaces and containers utilize the neutral tones (#8C716D) to maintain a premium, earthy, yet technical feel compared to sterile cold greys.
- **Typography Tinting:** Text uses a deep, warm-toned dark brown/grey rather than pure black to maintain a softer, more premium feel while retaining maximum contrast against the warm surface tints.

## Typography

The typography system is optimized for **RTL (Arabic) first** rendering. It uses **Be Vietnam Pro** for English numerals and technical terms, paired with high-quality, high-contrast Arabic counterparts that ensure legibility in dense technical spec sheets.

- **Headlines:** Large, bold, and authoritative. Headlines should have a slight negative letter spacing on larger sizes to feel "tighter" and more editorial.
- **Body:** Focused on readability. Line heights are generous (1.5x+) to accommodate complex Arabic script and ensure a comfortable reading experience for long-form reviews and build guides.
- **Directionality:** All type alignments are right-aligned by default. Numeric values (prices, specs) should maintain a clear, legible weight to stand out within Arabic sentences.

## Layout & Spacing

The design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Rhythm:** An 8pt linear scaling system is used for all padding and margins. 
- **RTL Logic:** Layout flows from right to left. The sidebar/filters on category pages reside on the right, and the content flows to the left. 
- **Safe Areas:** On desktop, the main content container is capped at 1280px to prevent technical spec tables from becoming too wide to scan.
- **Product Grids:** Components are spaced with 24px gutters to allow the white space to act as a separator, minimizing the need for heavy borders.

## Elevation & Depth

Hierarchy is established through a combination of **Tonal Layering** and **Ambient Shadows**.

- **Level 0 (Base):** The primary background surface, utilizing soft neutral tints.
- **Level 1 (Cards/Sections):** Used for product cards and content blocks. These use a very soft, highly diffused shadow (Blur: 20px, Y: 4px, Opacity: 4%) with a subtle 1px border.
- **Level 2 (Navigation/Floating):** The top navigation bar uses a **Glassmorphism** effect: a semi-transparent surface with a 12px backdrop blur. This keeps the user grounded in their vertical position on the page.
- **Interactions:** On hover, cards should lift slightly (increase Y-offset of shadow) to provide tactile feedback to the user.

## Shapes

The shape language is "Soft-Modern." All primary UI elements like buttons, input fields, and product cards utilize a **16px (rounded-lg)** or **24px (rounded-xl)** corner radius. 

This high degree of roundedness serves two purposes: it makes the technical hardware feel more approachable and mimics the industrial design of high-end modern electronics. Smaller elements like tags or "In Stock" badges should use a full pill-shape (999px) to distinguish them from structural components.

## Components

### Buttons
- **Primary:** Solid #E82324 with white text. 16px corner radius. Includes a subtle transition to a slightly brighter red on hover.
- **Secondary:** Ghost style with #E82324 border and text.
- **Buy Button:** On product pages, the "Add to Cart" button should be oversized with a shadow to emphasize the primary conversion point.

### Product Cards
- Cards feature a subtle neutral-tinted surface container for the image area to create contrast against white product photography.
- Information (Title, Price, Rating) is right-aligned.
- Hover state: The card lifts and a quick-add button appears via a slide-up animation.

### Form Inputs
- Large 48px height for accessibility. 
- 16px rounded corners.
- Focus state: 2px solid #E82324 border with a soft red outer glow.

### Status Chips
- **In Stock:** Soft blue background (derived from Tertiary #0081BA) with dark blue text.
- **Low Stock:** Soft secondary crimson background with dark crimson text.
- All chips are pill-shaped (32px height).

### Technical Spec Tables
- Uses alternating row colors (White and soft Neutral surface tints).
- Labels are in secondary neutral text with values in the dark neutral primary text.
- Borders are kept to a minimum (only horizontal separators).