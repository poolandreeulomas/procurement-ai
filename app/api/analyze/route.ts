import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    const body = await request.json();
    const requestText = body?.requestText;

    console.log("/api/analyze received requestText:", requestText);

    if (!requestText) {
        return NextResponse.json({ error: "requestText is required" }, { status: 400 });
    }

    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    });

    try {
        const completion = await openai.chat.completions.create({
            model: "nvidia/nemotron-3-nano-30b-a3b:free",
            messages: [
                {
                    role: "system",
                    content: "You are an AI that extracts structured procurement information from procurement request text. Analyze the text and return only a valid JSON array of objects, where each object has the following fields: product (string), quantity (number or null), brands (array of strings or empty array), budget_per_unit (number or null), delivery_deadline (string or null), location (string or null). If a field is not mentioned or cannot be determined, use null for single values or empty array for brands. If there is only one item, return an array with one object."
                },
                { role: "user", content: requestText }
            ]
        });

        const aiResponse = completion.choices[0].message.content;
        console.log("AI response:", aiResponse);

        if (!aiResponse) {
            return NextResponse.json({ error: "No response from AI" }, { status: 500 });
        }

        let parsedData;
        try {
            parsedData = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        if (!Array.isArray(parsedData)) {
            console.error("AI response is not an array:", parsedData);
            return NextResponse.json({ error: "AI response must be an array of items" }, { status: 500 });
        }

        try {
            // Insert the procurement request
            const { data: requestData, error: requestError } = await supabase
                .from("procurement_requests")
                .insert({ request_text: requestText })
                .select("id")
                .single();

            if (requestError) {
                console.error("Failed to insert procurement request:", requestError);
                return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
            }

            const requestId = requestData.id;
            console.log("Created procurement request with id:", requestId);

            // Insert the procurement items
            const itemsToInsert = parsedData.map(item => ({
                request_id: requestId,
                product: item.product ?? null,
                quantity: item.quantity ?? null,
                brands: item.brands ?? [],
                budget_per_unit: item.budget_per_unit ?? null,
                delivery_deadline: item.delivery_deadline ?? null,
                location: item.location ?? null,
            }));

            const { error: itemsError } = await supabase
                .from("procurement_items")
                .insert(itemsToInsert);

            if (itemsError) {
                console.error("Failed to insert procurement items:", itemsError);
                return NextResponse.json({ error: "Failed to save items" }, { status: 500 });
            }

            console.log(`Inserted ${parsedData.length} procurement items for request id ${requestId}.`);
        } catch (insertException) {
            console.error("Unexpected error inserting data:", insertException);
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Error calling OpenAI:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
