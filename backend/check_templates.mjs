import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const envVars = {};
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=["']?(.+?)["']?\s*$/);
  if (match) envVars[match[1].trim()] = match[2];
}

const WABA_ID = envVars.META_WHATSAPP_BUSINESS_ACCOUNT_ID;
const ACCESS_TOKEN = envVars.META_WHATSAPP_ACCESS_TOKEN;
const API_VERSION = envVars.META_WHATSAPP_API_VERSION || "v21.0";

async function checkTemplates() {
  const url = `https://graph.facebook.com/${API_VERSION}/${WABA_ID}/message_templates?access_token=${ACCESS_TOKEN}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (res.ok) {
      console.log("Templates fetched successfully:\n");
      data.data.forEach(t => {
        console.log(`- Name: ${t.name}`);
        console.log(`  Language: ${t.language}`);
        console.log(`  Status: ${t.status}`);
        console.log(`  Category: ${t.category}`);
        console.log("------------------------");
      });
    } else {
      console.log("Failed to fetch:", JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

checkTemplates();
