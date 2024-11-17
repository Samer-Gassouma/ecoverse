import { GoogleGenerativeAI } from "@google/generative-ai";

const safetySettings : any = {
  "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
  "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
  "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
};

const genAI = new GoogleGenerativeAI('AIzaSyDC4fw6MXgHVMfZAWS5xnIKT0yV2ZQfzCU');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });

export default model;