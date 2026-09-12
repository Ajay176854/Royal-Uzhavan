import fs from 'fs';
import path from 'path';

const translateToTamil = async (text) => {
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURI(text)}`);
    const json = await res.json();
    return json[0][0][0];
  } catch (error) {
    console.error(`Failed to translate: ${text}`, error);
    return text; // Fallback to English if translation fails
  }
};

const processTranslations = async () => {
  const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const products = JSON.parse(rawData);

  console.log(`Starting translation for ${products.length} products...`);
  
  for (let i = 0; i < products.length; i++) {
    if (!products[i].name_tamil) {
      products[i].name_tamil = await translateToTamil(products[i].name);
      console.log(`Translated [${i+1}/${products.length}]: ${products[i].name} -> ${products[i].name_tamil}`);
      // Sleep for 100ms to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log('Translation complete and saved to products.json!');
};

processTranslations();
