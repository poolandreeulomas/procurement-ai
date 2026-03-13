import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Fetch procurement requests ordered by created_at descending
        const { data: requests, error: requestsError } = await supabase
            .from("procurement_requests")
            .select("id, request_text, created_at")
            .order("created_at", { ascending: false });

        if (requestsError) {
            console.error("Error fetching procurement requests:", requestsError);
            return NextResponse.json(
                { error: "Failed to fetch procurement requests" },
                { status: 500 }
            );
        }

        if (!requests || requests.length === 0) {
            return NextResponse.json([]);
        }

        // Fetch items for each request
        const requestsWithItems = await Promise.all(
            requests.map(async (request) => {
                const { data: items, error: itemsError } = await supabase
                    .from("procurement_items")
                    .select("product, quantity, brands, budget_per_unit, delivery_deadline, location")
                    .eq("request_id", request.id);

                if (itemsError) {
                    console.error(`Error fetching items for request ${request.id}:`, itemsError);
                    return { ...request, items: [] };
                }

                return { ...request, procurement_items: items || [] };
            })
        );

        return NextResponse.json(requestsWithItems);
    } catch (error) {
        console.error("Unexpected error in /api/requests:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}