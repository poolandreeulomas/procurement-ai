"use client";

import React, { useState, useEffect } from 'react';
import ProcurementItemsGrid from './ProcurementItemsGrid';

interface ProcurementItem {
    product: string;
    quantity?: number | null;
    brands?: string | string[] | null;
}

interface ProcurementRequest {
    id: string;
    request_text: string;
    created_at: string;
    procurement_items: ProcurementItem[];
}

export default function ProcurementDashboard() {
    const [requests, setRequests] = useState<ProcurementRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await fetch('/api/requests');
                if (!res.ok) {
                    throw new Error('Failed to fetch requests');
                }
                const data: ProcurementRequest[] = await res.json();
                setRequests(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Processed Procurement Requests
                </h1>
                {requests.length === 0 ? (
                    <div className="text-center text-gray-500 text-lg">
                        No requests found.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {requests.map((request) => (
                            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                        Request
                                    </h2>
                                    <p className="text-gray-700">{request.request_text}</p>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                        Items ({request.procurement_items.length}{request.procurement_items.length > 3 ? ' total' : ''})
                                    </h3>
                                    <ProcurementItemsGrid items={request.procurement_items} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}