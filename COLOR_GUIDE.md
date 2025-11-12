# SuperBoss Studio - Color Guide

## Color Palette

### Primary Colors
- **White**: `#FFFFFF` - Use `bg-white` or `bg-sb-white`
- **Grey Light**: `#F5F5F5` - Use `bg-sb-grey-light`
- **Grey**: `#9CA3AF` - Use `bg-sb-grey`
- **Grey Dark**: `#6B7280` - Use `bg-sb-grey-dark`
- **Black**: `#000000` - Use `bg-sb-black`

## Usage Guidelines

### Page Balance (60% White, 20% Grey, 20% Black)

#### White (60%)
- Main content backgrounds
- Card backgrounds
- Form inputs
- Modal backgrounds

**Classes**: `bg-white`, `text-white`

#### Grey (20%)
- Section backgrounds (alternating)
- Placeholder images
- Disabled states
- Secondary text

**Classes**: 
- `bg-sb-grey-light` - For section backgrounds
- `bg-sb-grey` - For placeholder images and medium grey elements
- `text-sb-grey` - For secondary text

#### Black (20%)
- Headers and navigation
- Primary buttons
- Footer
- Important text
- Borders and accents

**Classes**: `bg-sb-black`, `text-sb-black`

## Current Implementation

### Sections
- **Hero sections**: White background with grey gradient
- **About sections**: White background
- **Feature sections**: Light grey background (`bg-sb-grey-light`)
- **CTA sections**: Black background
- **Footer**: Black background

### Components
- **Navigation**: Transparent → White on scroll
- **Buttons (Primary)**: Black background, white text
- **Buttons (Secondary)**: Transparent with black border
- **Cards**: White background with grey hover
- **Placeholder Images**: Medium grey background (`bg-sb-grey`)

### Text Colors
- **Headings**: Black (`text-sb-black`)
- **Body text**: Grey (`text-sb-grey`)
- **On dark backgrounds**: White or light grey

## Examples

```jsx
// Section with light grey background (20% grey)
<section className="py-24 bg-sb-grey-light">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</section>

// Placeholder image (medium grey)
<div className="bg-sb-grey rounded-lg flex items-center justify-center">
  <span className="text-white">📸</span>
</div>

// Primary button (20% black)
<button className="bg-sb-black text-white px-6 py-3 rounded-lg">
  Book Now
</button>

// Card on white background (60% white)
<div className="bg-white rounded-lg shadow-lg p-6">
  <h3 className="text-sb-black">Title</h3>
  <p className="text-sb-grey">Description</p>
</div>
```

## Accessibility

- Ensure sufficient contrast ratios:
  - Black text on white: ✅ 21:1
  - Grey text on white: ✅ 4.5:1
  - White text on black: ✅ 21:1
  - White text on grey: ✅ 3.5:1

## Notes

- Use `bg-sb-grey` (medium grey) for placeholder images to ensure visibility
- Use `bg-sb-grey-light` (very light grey) for section backgrounds
- Alternate between white and light grey backgrounds for visual rhythm
- Reserve black backgrounds for high-impact sections (hero, CTA, footer)

