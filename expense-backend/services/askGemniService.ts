import {GoogleGenerativeAI  } from '@google/generative-ai';
import { Transaction } from '../shared/interfaces/transaction.model.js';
import { Category } from '../shared/interfaces/category.model.js';

export async function getExpenses(description: string, categories:Category[], accountId:number) {
  const apiKey: string | undefined = process.env['GEMINI_API_KEY'];
  const genAI = new GoogleGenerativeAI(apiKey??'');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or choose another suitable model

    const currentDate = new Date().toISOString().slice(0, 10);
    const categoryListString = JSON.stringify(categories.map(cat => ({ id: cat.id, name: cat.name })));
    const prompt = `Analyze the given expense description:"${description}", associated with given Account Id: ${accountId} and the following list of categories: ${categoryListString}
    Your task is to identify all possible financial transactions described in the input and return them as a JSON array of Transaction objects.
    Each Transaction object should have the following structure:
    \`\`\`json
    [
    {
    "date": "YYYY-MM-DD",
    "accountId": number, // account ID (e.g., 1) is passed as parameter to this function
    "categoryId": number, // Map to the ID of the most relevant category from the provided list
    "amount": number,
    "description": "string" // Use the relevant part of the input description for this transaction
    }]
    \`\`\`
    If no category fits well or the description is unclear, use "Uncategorized".
    If the date is not explicitly mentioned in the description, use today's date ("${currentDate}").
    Try to identify the amount and map the transaction to the most appropriate category from the provided list based on the description.
    If the input description contains multiple transactions (e.g., "Bought milk for Rs. 3 and bread for Rs. 2"), return an array with multiple Transaction objects.
    If no clear transaction can be identified, return an empty JSON array.
    Example:
    Description: "500 for grocerries 5th March 2025; 200 for petrol 11/04/2025"
    Categories: [{"id": 1, "name": "Food"}, {"id": 2, "name": "Groceries", "parentCategoryId": 1},
    {"id": 3, "name": "Transportation"}]
    accountId: 3
    Output:
    \`\`\`json
    [
    {
        "date": "${new Date("03/05/2025").toISOString().slice(0, 10)}",
        "accountId": 3,
        "categoryId": 2,
        "amount": 500,
        "description": "500 for grocerries"
    },
    {
        "date": "${new Date("04/11/2025").toISOString().slice(0, 10)}",
        "accountId": 3,
        "categoryId": 3,
        "amount": 500,
        "description": "200 for petrol"
    }
]`.trim();

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
            let jsonString = responseText;

            // Remove markdown code block delimiters if present
            if (responseText.startsWith('```json') && responseText.endsWith('```')) {
              jsonString = responseText.substring(7, responseText.length - 3).trim();
            } else if (responseText.startsWith('```json')) {
              jsonString = responseText.substring(7).trim();
            } else if (responseText.endsWith('```')) {
              jsonString = responseText.substring(0, responseText.length - 3).trim();
            }
            try {
              const transactions: Transaction[] = JSON.parse(jsonString);
              return transactions;
            } catch (error) {
                console.error('Error parsing Gemini response (after cleanup):', error);
                console.error('Problematic JSON string:', jsonString);
                return [];
            }
          } else {
            return [];
          }
        // Basic validation: Ensure it's one of the expected categories
        // if (![...categoryNames, "Uncategorized"].includes(text)) {
        //      console.warn(`Gemini returned an unexpected category: '${text}'. Falling back to Uncategorized.`);
        //      text = "Uncategorized";
        // }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        // Fallback in case of API error
        return [];
    }
}

export async function testGemini(){
    try{
    //const result = await model.generateContent("Explain how AI works in a few words");
    return "test";
    }
    catch(error)
    {
        console.error("Error calling Gemini API:", error);
        return "Error occured";
    }
    
}
export default {getExpenses, testGemini};
//module.exports = { getExpenseCategory };