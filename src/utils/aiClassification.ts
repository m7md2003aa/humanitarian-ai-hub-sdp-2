import { ItemCategory } from '../types/donations';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as FileSystem from 'expo-file-system';

export interface AIClassificationResult {
  category: ItemCategory;
  confidence: number;
  suggestions?: string[];
  title?: string;
  size?: string;
  color?: string;
  clothType?: string;
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// AI image classification using Google Gemini
export const classifyImage = async (imageUri: string, description?: string): Promise<AIClassificationResult> => {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, using fallback classification');
      return fallbackClassification(description);
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Read the image file as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Create the prompt for classification
    const prompt = `Analyze this clothing/item image and provide detailed classification in JSON format:

{
  "category": "clothing" or "other",
  "title": "A short descriptive title for the item (e.g., 'Blue Denim Jacket', 'Red Cotton T-Shirt')",
  "clothType": "specific type of clothing (e.g., 'T-shirt', 'Jeans', 'Jacket', 'Dress', 'Sweater', 'Shoes', etc.)",
  "size": "estimated size (e.g., 'Small', 'Medium', 'Large', 'XL', 'Kids', 'Adult', or 'N/A' if not determinable)",
  "color": "primary color(s) (e.g., 'Blue', 'Red', 'Black', 'Multi-color')",
  "confidence": a number between 0 and 1 representing confidence level
}

If this is clothing, set category to "clothing". For non-clothing items, set category to "other" and still provide a descriptive title.
Be specific and accurate. Return ONLY the JSON object, no other text.`;

    // Generate content with the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Could not parse Gemini response, using fallback');
      return fallbackClassification(description);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      category: parsed.category === 'clothing' ? 'clothing' : 'other',
      confidence: parsed.confidence || 0.8,
      title: parsed.title,
      size: parsed.size,
      color: parsed.color,
      clothType: parsed.clothType,
      suggestions: generateSuggestions(parsed.category),
    };
  } catch (error) {
    console.error('Gemini classification error:', error);
    return fallbackClassification(description);
  }
};

// Fallback classification when Gemini is unavailable
const fallbackClassification = (description?: string): AIClassificationResult => {
  const categories: ItemCategory[] = ['clothing', 'other'];

  let suggestedCategory: ItemCategory = 'other';
  let confidence = 0.7;

  if (description) {
    const lowerDesc = description.toLowerCase();

    if (lowerDesc.includes('shirt') || lowerDesc.includes('pants') || lowerDesc.includes('dress') ||
        lowerDesc.includes('clothes') || lowerDesc.includes('jacket') || lowerDesc.includes('shoes') ||
        lowerDesc.includes('socks')) {
      suggestedCategory = 'clothing';
      confidence = 0.9;
    }
  } else {
    suggestedCategory = categories[Math.floor(Math.random() * categories.length)];
  }

  return {
    category: suggestedCategory,
    confidence,
    suggestions: generateSuggestions(suggestedCategory),
  };
};

const generateSuggestions = (category: ItemCategory): string[] => {
  const suggestionMap = {
    clothing: ['Check for stains or damage', 'Wash before donation', 'Include size information'],
    other: ['Provide detailed description', 'Include condition information', 'Add usage instructions'],
  };
  
  return suggestionMap[category] || [];
};

// Generate realistic credit values based on category
export const estimateCreditValue = (category: ItemCategory, condition: 'excellent' | 'good' | 'fair' = 'good'): number => {
  const baseValues = {
    clothing: 12,
    other: 10,
  };
  
  const conditionMultiplier = {
    excellent: 1.5,
    good: 1.0,
    fair: 0.7,
  };
  
  return Math.round(baseValues[category] * conditionMultiplier[condition]);
};