import React, { useState } from 'react';
import ProcurementItemCard from './ProcurementItemCard';

interface ProcurementItem {
    product: string;
    quantity?: number | null;
    brands?: string | string[] | null;
}

interface ProcurementItemsGridProps {
    items: ProcurementItem[];
}

export default function ProcurementItemsGrid({ items }: ProcurementItemsGridProps) {
    const [expanded, setExpanded] = useState(false);

    if (!items || items.length === 0) {
        return <div className="text-center text-gray-500">No items to display.</div>;
    }

    const displayedItems = expanded || items.length <= 3 ? items : items.slice(0, 3);

    let gridClass = 'grid gap-4';
    if (displayedItems.length === 1) {
        gridClass += ' grid-cols-1 place-items-center';
    } else if (displayedItems.length === 2) {
        gridClass += ' grid-cols-1 sm:grid-cols-2';
    } else {
        gridClass += ' grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
    }

    return (
        <div>
            <div className={gridClass}>
                {displayedItems.map((item, index) => (
                    <ProcurementItemCard key={index} {...item} />
                ))}
            </div>
            {items.length > 3 && !expanded && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">More items in this request</p>
                    <button
                        onClick={() => setExpanded(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Show all items
                    </button>
                </div>
            )}
        </div>
    );
}