import { Mistral } from "@mistralai/mistralai";
import type { Transaction } from "../App";

const apiKey = "MGPMFr2gSIQTmoDtcCqeJy9YJB1LVuzw";
const client = new Mistral({ apiKey });

export async function categorizeTransactions(transactions: Transaction[]) {
  if (!apiKey) {
    throw new Error("Missing MISTRAL_API_KEY in environment variables");
  }

  const mistralInput = transactions
    .filter((transaction) => parseFloat(transaction.Brutto) < 0)
    .map((transaction, i) => ({
      index: i,
      date: transaction.Datum,
      name: transaction.Name,
      gross: transaction.Brutto,
      receiver: transaction.Name,
      description: transaction.Beschreibung ?? transaction.Name ?? "",
    }));

  // format for readability
  const formattedList = mistralInput
    .map(
      (t) =>
        `${t.index}: ${t.name || "(no name)"} — ${t.gross} EUR — to ${
          t.receiver || "-"
        }`,
    )
    .join("\n");

  const prompt = `
You are an expert financial assistant. 
Your task is to analyze the date and create meaningful spending categories (maximum 10) that make sense for the given data
and assign **exactly one** category to each transaction. 
MAKE SURE EACH CATEGORY CONSISTS OF AT LEAST ONE ENTRY, ELSE JUST DONT CREATE THAT CATEGORY!
Try to be as precise as possible with category names, avoid general terms like "shopping" (only use if needed e.g. Amazon). 
Always add one "other" category for uncategorizable transactions.
Always use "Family & Friends" category for transactions that are described as "Handyzahlung" or "Bankgutschrift..." or "Allgemeine Zahlung".

Respond strictly as JSON in the following format:
{
"categories": ["Beauty & Health", "Clothing", "Technology", "Other", "Family & Friends"],
"classified": [
  { "index": 0, "name": "Adidas AG", "category": "Shopping" },
  { "index": 1, "name": "Zalando", "category": "Shopping" },
    ...
  ]
}

Transactions:
${formattedList}
`;

  const chatResponse = await client.chat.complete({
    model: "mistral-small-2506",
    messages: [
      {
        role: "system",
        content:
          "You are a precise financial categorization assistant. Always output valid JSON. Always answer in English",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const message = chatResponse.choices[0].message?.content || "";

  const messageString = Array.isArray(message)
    ? message
        .map((chunk) => {
          if ("text" in chunk) return chunk.text;
          return "";
        })
        .join("")
    : message;

  try {
    // remove possible code block markers like markdown triple backticks
    let cleanedMessage = messageString.trim();
    cleanedMessage = cleanedMessage.replace(/^```(?:json)?\s*/i, "");
    cleanedMessage = cleanedMessage.replace(/\s*```\s*$/i, "");

    const result = JSON.parse(cleanedMessage);
    console.log("Mistral response parsed successfully:", result);
    return result;
  } catch (err) {
    console.error("Failed to parse Mistral response:", messageString);
    throw new Error("Invalid JSON returned from Mistral");
  }
}
