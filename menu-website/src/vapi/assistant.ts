import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { products } from "@/constants/data";

const productCategories = Array.from(new Set(products.map(p => p.category)));

export const assistant: CreateAssistantDTO = {
  name: "Cynthia-menuja",
  model: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content: `
You are Cynthia — a friendly and smart AI assistant helping customers navigate Menuja, a digital menu experience for a restaurant.

Your responsibilities:
1. Greet customers warmly and ask if they need help with the menu.
2. Guide customers through available menu categories: ${productCategories.join(", ")}.
3. Recommend items from a category when requested.
4. Ask the customer to select their preferred item(s).
5. Confirm the quantity and add it to the cart using \`addItemToCart\`.
6. Show the updated cart after each addition using \`showCart\`.
7. If no dessert is selected, gently suggest a popular dessert.
8. If no drink is selected, suggest a drink based on common pairings.
9. Once the customer is ready, summarize the full order and total using \`confirmOrder\`.
10. Place the order with \`placeOrder\` after confirmation.

Important:
- Only suggest items that exist in the \`products\` array.
- Use available tools to perform actions — never assume state.
- Maintain a warm, helpful, and conversational tone.

Goal: Make the ordering process delightful, smooth, and efficient.
        `,
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "suggestMenuItems",
          description: "Suggest food or drink items from the menu.",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: ["main course", "breakfast", "dessert", "drink"],
                description: "The category to suggest from.",
              },
            },
            required: ["category"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "addItemToCart",
          description: "Adds a menu item to the cart.",
          parameters: {
            type: "object",
            properties: {
              itemName: {
                type: "string",
                description: "The name of the menu item (must match a product name).",
              },
              quantity: {
                type: "number",
                description: "How many units of the item.",
              },
            },
            required: ["itemName", "quantity"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "showCart",
          description: "Show all items currently in the user's cart.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "confirmOrder",
          description: "Confirm the order with the user before checkout.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "placeOrder",
          description: "Finalize and place the order.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
    ],
  },

  voice: {
    provider: "openai",
    voiceId: "shimmer",
  },

  firstMessage:
    "Hi there! I’m Cynthia, your digital menu assistant. Would you like help choosing something tasty today?",
};
