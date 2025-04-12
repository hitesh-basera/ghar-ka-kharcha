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
const { getExpenseCategory } = require('../services/askGemniService');
const router = express.Router();
router.post('/process', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // --- Basic Input Validation ---
    const { description, amount, date, categories } = req.body;
    if (!description || typeof description !== 'string' || description.trim() === '') {
        return res.status(400).json({ message: 'Invalid or missing description.' });
    }
    try {
        // --- Fetch Categories ---
        // Assuming dbService.getAllCategories returns Promise<Category[]>
        // where Category is an interface like { id: number; name: string; }
        //const categories = categories;
        if (!categories || categories.length === 0) {
            console.error("No categories found in the database.");
            return res.status(500).json({ message: "Internal server error: Could not load categories." });
        }
        const categoryNames = categories.map((cat) => cat.name).filter((name) => name.toLowerCase() !== 'uncategorized');
        const uncategorizedCategory = categories.find((cat) => cat.name.toLowerCase() === 'uncategorized');
        if (!uncategorizedCategory) {
            console.error("CRITICAL: 'Uncategorized' category definition missing in database.");
            return res.status(500).json({ message: "Internal server error: Default category configuration missing." });
        }
        // --- End Fetch Categories ---
        // --- Get Category Suggestion ---
        const suggestedCategoryName = yield getExpenseCategory(description, categoryNames);
        // --- End Get Category Suggestion ---
        // --- Find Final Category ID ---
        const finalCategory = categories.find((cat) => cat.name === suggestedCategoryName) || uncategorizedCategory;
        const finalCategoryId = finalCategory.id;
        // Use the specific type for the JSON response
        res.status(200).json({
            categoryId: finalCategoryId,
            amount: amount,
            date: date,
            description: description
        }); // Type assertion for clarity
        // --- End Send Success Response ---
    }
    catch (error) {
        console.error("Error processing expense:", error);
        // You might want to check the error type if needed
        res.status(500).json({ message: "Internal server error while processing expense data." });
    }
}));
export default router; // Use export default if using ES module syntax
//module.exports = router;//for common js
