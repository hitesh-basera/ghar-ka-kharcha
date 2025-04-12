var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env['GEMINI_API_KEY']);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or choose another suitable model
function getExpenseCategory(description, categoryNames) {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryListString = categoryNames.join("\n- ");
        const prompt = `
Analyze the following expense description and return only the single best-fitting category name from the provided list.
Do not add any explanation, introduction, or extra text.
If no category fits well or the description is unclear, return "Uncategorized".

Expense Description: "${description}"

Available Categories:
- ${categoryListString}
- Uncategorized
    `.trim();
        try {
            const result = yield model.generateContent(prompt);
            const response = yield result.response;
            let text = response.text().trim();
            // Basic validation: Ensure it's one of the expected categories
            if (![...categoryNames, "Uncategorized"].includes(text)) {
                console.warn(`Gemini returned an unexpected category: '${text}'. Falling back to Uncategorized.`);
                text = "Uncategorized";
            }
            return text;
        }
        catch (error) {
            console.error("Error calling Gemini API:", error);
            // Fallback in case of API error
            return "Uncategorized";
        }
    });
}
module.exports = { getExpenseCategory };
export {};
