import { GoogleGenAI } from "@google/genai";
import express from "express";
import dotenv from 'dotenv';

const app = express();
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static("public"));


dotenv.config({ path: '.env' });
const API_KEY =  process.env.GEMINI_API;
// console.log(API_KEY);

const ai = new GoogleGenAI({apiKey: API_KEY});

// const conversationHistory = []; 

async function main(getUserName, getUserQst = false) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: [
      {
        role: "user",
        parts: [
          {
            text:`You are an expert chatbot specialized in CRM (Customer Relationship Management) systems and you name is ZynkFlow.

            ==> RULES: <==

            1. CONTENT RULES
            - Only talk about CRM topics: automation, workflows, integrations, B2B tools, HubSpot, Salesforce, n8n, etc.
            - If the question is not related to CRM, reply with:
              "I'm sorry, I can only answer questions related to CRM systems."
            - Give strong, educational CRM explanations.
            - Do not repeat greetings after the first interaction.

            2. FORMAT RULES (VERY IMPORTANT)
            - ALWAYS use structure.
            - ALWAYS use new lines.
            - NEVER answer in one long paragraph.
            - Use:
              • Headings
              • Bullet points
              • Numbered lists
              • Short 1–2 line paragraphs
            - Make the answer clean, organized, and easy to read.

            3. STYLE RULES
            - Professional, simple, and clear.
            ${getUserQst ? `Start by saying 'Hello' to ${getUserName} and a short welcome message about CRM systems.` : ""}
            
            User: ${getUserName}`
          }
        ],
      },
        // ...conversationHistory,
    ],
  });
  
  // const botResponse =  response.text;

  //   conversationHistory.push({
  //     role:"model",
  //     parts:[{text: botResponse}] 
  //   });

  console.log(response.text);
  return response.text;
}

// the first page
app.get("/", (req, res)=>{
    res.render("index.ejs");
});

// when i submit 
app.post("/ZynkFlow", async(req, res)=>{

  const getUserName = req.body.firstName;
  const botAnswer = await main(getUserName, true);
  res.render("bot.ejs", {answer: botAnswer});

});

// when ask 
app.post("/chat", async(req, res)=>{
  
  const getUserQst = req.body.message;
  console.log("===============================");
  console.log(getUserQst);
  console.log("===============================");

  const botAnswer = await main(getUserQst, false);
  res.json({answer: botAnswer});
  
});

export default app;