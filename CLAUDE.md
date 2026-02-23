# WECLE 四條畷店 LP Project

## Overview
WECLE（ウィークル）四條畷店のオープン記念ランディングページ。
ストレッチ×ピラティス専門スタジオの集客用LP。

## Tech Stack
- HTML5 / CSS3 / Vanilla JavaScript
- No frameworks, no build tools
- Google Fonts (Noto Sans JP)
- Mobile-first responsive design

## Design Tokens
### Colors
- Primary: #00A5A8 (teal)
- Text Dark: #1A2B3C
- Background Warm: #F5F3F0
- Accent Orange: #FF6B35
- Gold: #D4A843
- White: #FFFFFF

### Typography
- Font: Noto Sans JP (400, 500, 700)
- H1: 28px(SP) / 48px(PC)
- H2: 24px(SP) / 36px(PC)
- Body: 16px(SP) / 16px(PC)

### Breakpoints
- SP: 375px (base)
- Tablet: 768px
- Desktop: 1024px
- Wide: 1440px

## File Structure
```
index.html          - Main HTML (all sections)
css/style.css       - Styles (mobile-first)
js/main.js          - Interactions (FAQ, sticky header, CTA, GTM)
images/             - Placeholder images
```

## Sections
0. Fixed Header (sticky)
1. Hero / First View
2. Pain Points (empathy)
3. Three Freedoms (features)
3.5. Comparison Table
4. Flow (how to use)
5. Pricing
6. Campaign CTA
7. Testimonials
8. Studio Info & Access
9. FAQ (accordion)
10. Final CTA
11. Footer
+ Mobile Fixed CTA Bar

## Performance Targets
- Mobile PageSpeed: 90+
- Desktop PageSpeed: 95+
- LCP: < 2.5s

## Accessibility
- Contrast ratio: 4.5:1+
- ARIA labels on interactive elements
- Keyboard navigation support
- Skip to content link

## Rules
- All text content in Japanese
- Code comments in English
- CSS variables for all design tokens
- Semantic HTML5 elements
- No inline styles
- GTM dataLayer events for tracking
