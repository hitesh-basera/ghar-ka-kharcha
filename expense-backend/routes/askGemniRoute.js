var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { getExpenses, testGemini } from '../services/askGemniService.js';
const router = express.Router();
router.post('/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // --- Basic Input Validation ---
    const { description, categories, accountId } = req.body;
    if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ message: 'Invalid or missing description.' });
    }
    try {
        // --- Fetch Categories ---
        // where Category is an interface like { id: number; name: string; }
        //const categories = categories;
        if (!categories || categories.length === 0) {
            console.error("No categories found.");
            return res.status(500).json({ message: "Internal server error: No categories to load." });
        }
        // --- End Fetch Categories ---
        // --- Get Transactions Suggestion ---
        const suggestedTransactions = yield getExpenses(description, categories, accountId);
        // --- End Get Category Suggestion ---
        // --- Find Final Category ID ---
        // const finalCategory = categories.find((cat: { name: any; }) => cat.name === suggestedCategoryName) || uncategorizedCategory;
        // const finalCategoryId = finalCategory.id;
        // --- End Find Final Category ID ---
        // --- Send Success Response ---
        // Define response body type for clarity (optional but good practice)
        // interface ProcessResponseBody {
        //     categoryId: number;
        //     amount: number;
        //     date: string;
        //     description: string;
        // }
        // Use the specific type for the JSON response
        // res.status(200).json({
        //     categoryId: finalCategoryId,
        //     amount: amount,
        //     date: date,
        //     description: description
        // } as ProcessResponseBody); // Type assertion for clarity
        res.status(200).json(suggestedTransactions); // Type assertion for clarity
        // --- End Send Success Response ---
    }
    catch (error) {
        console.error("Error processing expense:", error);
        // You might want to check the error type if needed
        res.status(500).json({ message: "Internal server error while processing expense data." });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield testGemini();
    res.json(response);
}));
export default router; // Use export default if using ES module syntax
//module.exports = router;//for common js
