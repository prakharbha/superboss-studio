# Adding Profoto Pro-D3 750WS Monolight Equipment

## Instructions

1. **Place the image file** in the project root directory with one of these names:
   - `profoto-pro-d3.jpg`
   - `profoto-pro-d3.png`
   - `profoto-pro-d3.jpeg`
   
   OR provide the full path as an argument when running the script.

2. **Run the script**:
   ```bash
   npm run add:profoto
   ```
   
   Or with a custom image path:
   ```bash
   node scripts/add-profoto-equipment.js /path/to/your/image.jpg
   ```

## What the script does:

1. **Processes the image**:
   - Crops out the dark gray border (5% from each side)
   - Crops out the text area at the bottom (30% from bottom)
   - Resizes to 800x800px (maintaining aspect ratio)
   - Converts to WebP format for optimal web performance
   - Saves to `public/images/equipment/profoto-pro-d3-750ws.webp`

2. **Uploads to Sanity**:
   - Uploads the processed image to Sanity CMS
   - Creates an image asset reference

3. **Adds equipment to Sanity**:
   - Creates/updates the equipment document with:
     - Name: Profoto Pro-D3 750WS Monolight
     - Category: Lighting
     - Price: AED 150/day
     - Description and specifications
     - Image reference

## Equipment Details:

- **Name**: Profoto Pro-D3 750WS Monolight
- **Category**: Lighting
- **Price**: AED 150/day
- **Available**: Yes
- **Specifications**:
  - 750WS power output
  - Fast recycling time
  - Consistent color temperature
  - Professional studio quality
  - Compatible with Profoto modifiers

## Notes:

- If the image file is not found, the equipment will still be added but without an image. You can upload the image manually via Sanity Studio.
- The cropping values can be adjusted in the script if needed based on your specific image.

