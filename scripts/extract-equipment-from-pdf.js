const fs = require('fs');
const path = require('path');

const pdfPath = path.join(process.cwd(), 'Equipment with price (3).pdf');
const outputPath = path.join(process.cwd(), 'scripts', 'equipment-details.txt');

async function extractEquipmentData() {
  try {
    console.log('📄 Reading PDF file...\n');
    
    if (!fs.existsSync(pdfPath)) {
      console.error(`❌ PDF file not found at: ${pdfPath}`);
      process.exit(1);
    }
    
    // Use pdf-parse - PDFParse is a class that needs to be instantiated
    const { PDFParse } = require('pdf-parse');
    
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const data = await parser.getText();
    
    console.log(`Total pages: ${data.total}`);
    console.log(`Total text length: ${data.text.length} characters\n`);
    
    // Write full text to a file for analysis
    const fullTextPath = path.join(process.cwd(), 'scripts', 'equipment-pdf-full-text.txt');
    fs.writeFileSync(fullTextPath, data.text);
    console.log(`✓ Full text saved to: ${fullTextPath}\n`);
    
    // Try to extract equipment information
    const lines = data.text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const equipmentList = [];
    let currentEquipment = null;
    
    // Patterns to identify equipment entries
    const pricePattern = /AED\s*(\d+)/i;
    const hourPattern = /(\d+)\s*hr/i;
    const dayPattern = /(\d+)\s*day/i;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
      
      // Look for equipment names (usually lines that don't contain prices or common words)
      const isPriceLine = pricePattern.test(line);
      const isCommonWord = /^(rental|price|hour|day|per|equipment|category|description)$/i.test(line);
      
      // If we find a price, look backwards for the equipment name
      if (isPriceLine && !currentEquipment) {
        // Look back up to 3 lines for equipment name
        for (let j = Math.max(0, i - 3); j < i; j++) {
          const potentialName = lines[j];
          if (potentialName && potentialName.length > 3 && !pricePattern.test(potentialName)) {
            currentEquipment = {
              name: potentialName,
              prices: {},
              rawText: []
            };
            break;
          }
        }
      }
      
      // Extract prices
      if (currentEquipment) {
        currentEquipment.rawText.push(line);
        
        const hourMatch = line.match(/(\d+)\s*hr.*?AED\s*(\d+)/i);
        const dayMatch = line.match(/(\d+)\s*day.*?AED\s*(\d+)/i);
        const simplePriceMatch = line.match(/AED\s*(\d+)/i);
        
        if (hourMatch) {
          const hours = hourMatch[1];
          const price = parseInt(hourMatch[2]);
          currentEquipment.prices[`${hours}hour`] = price;
        } else if (dayMatch) {
          const days = dayMatch[1];
          const price = parseInt(dayMatch[2]);
          currentEquipment.prices[`${days}day`] = price;
        } else if (simplePriceMatch && !currentEquipment.prices.hour && !currentEquipment.prices.day) {
          // Try to infer if it's hourly or daily based on context
          const price = parseInt(simplePriceMatch[1]);
          if (line.toLowerCase().includes('hour') || line.toLowerCase().includes('hr')) {
            currentEquipment.prices.hour = price;
          } else if (line.toLowerCase().includes('day')) {
            currentEquipment.prices.day = price;
          }
        }
        
        // If we hit another equipment name or empty section, save current equipment
        if (i < lines.length - 1) {
          const nextIsName = lines[i + 1] && lines[i + 1].length > 3 && 
                            !pricePattern.test(lines[i + 1]) && 
                            !isCommonWord &&
                            !lines[i + 1].match(/^\d+$/);
          
          if (nextIsName && currentEquipment.name !== lines[i + 1]) {
            if (currentEquipment.name && Object.keys(currentEquipment.prices).length > 0) {
              equipmentList.push(currentEquipment);
            }
            currentEquipment = null;
          }
        }
      }
    }
    
    // Save last equipment if exists
    if (currentEquipment && currentEquipment.name && Object.keys(currentEquipment.prices).length > 0) {
      equipmentList.push(currentEquipment);
    }
    
    // Write structured output
    let output = '================================================================================\n';
    output += 'EQUIPMENT DETAILS EXTRACTED FROM PDF\n';
    output += '================================================================================\n';
    output += `Extracted on: ${new Date().toLocaleString()}\n`;
    output += `Total equipment found: ${equipmentList.length}\n\n`;
    output += '================================================================================\n\n';
    
    equipmentList.forEach((equip, index) => {
      output += `${index + 1}. ${equip.name}\n`;
      output += '   Prices:\n';
      Object.entries(equip.prices).forEach(([key, value]) => {
        output += `     - ${key}: AED ${value}\n`;
      });
      output += '\n   Raw Text:\n';
      equip.rawText.slice(0, 5).forEach(line => {
        output += `     ${line}\n`;
      });
      output += '\n' + '─'.repeat(80) + '\n\n';
    });
    
    // Also write a simpler format for easy reading
    output += '\n\n================================================================================\n';
    output += 'SIMPLIFIED FORMAT (Name | Prices)\n';
    output += '================================================================================\n\n';
    
    equipmentList.forEach((equip, index) => {
      const prices = Object.entries(equip.prices)
        .map(([key, value]) => `${key}: AED ${value}`)
        .join(', ');
      output += `${index + 1}. ${equip.name} | ${prices}\n`;
    });
    
    fs.writeFileSync(outputPath, output);
    console.log(`✅ Equipment details saved to: ${outputPath}`);
    console.log(`\n📊 Summary:`);
    console.log(`   - Equipment found: ${equipmentList.length}`);
    console.log(`   - Full text saved to: ${fullTextPath}`);
    console.log(`\n💡 Note: Please review the extracted data and manually verify/correct as needed.`);
    console.log(`   Images from PDF need to be extracted separately using getImage() method.`);
    
  } catch (error) {
    console.error('❌ Error extracting equipment data:', error);
    process.exit(1);
  }
}

extractEquipmentData();
