import React from 'react';

interface ProcurementItemCardProps {
    product: string;
    quantity?: number | null;
    brands?: string | string[] | null;
    budget_per_unit?: number | null;
    delivery_deadline?: string | null;
    location?: string | null;
}

export default function ProcurementItemCard({
    product,
    quantity,
    brands,
    budget_per_unit,
    delivery_deadline,
    location,
}: ProcurementItemCardProps) {
    console.log("BRANDS:", brands);

    const imageMap: Record<string, string> = {
        laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        monitor: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
        server: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        gpu: 'https://images.unsplash.com/photo-1591488320449-011701bb6704',
        keyboard: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
        phone: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        'graphics card': 'https://images.unsplash.com/photo-1591488320449-011701bb6704',
    };

    const getCategory = (product: string): string => {
        const lower = product.toLowerCase();
        if (lower.includes('laptop') || lower.includes('macbook') || lower.includes('thinkpad') || lower.includes('xps') || lower.includes('surface')) {
            return 'laptop';
        }
        if (lower.includes('monitor') || lower.includes('display')) {
            return 'monitor';
        }
        if (lower.includes('gpu') || lower.includes('graphics card') || lower.includes('video card')) {
            return 'graphics card';
        }
        if (lower.includes('server')) {
            return 'server';
        }
        if (lower.includes('phone') || lower.includes('iphone') || lower.includes('android')) {
            return 'phone';
        }
        if (lower.includes('keyboard')) {
            return 'keyboard';
        }
        // Default to 'laptop' or something, but better to return empty
        return '';
    };

    const category = getCategory(product);
    const imageUrl = category && imageMap[category] ? imageMap[category] : 'https://picsum.photos/600/400';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img
                src={imageUrl}
                alt={product}
                className="w-full h-45 object-cover rounded-t-lg"
            />
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{product}</h3>
                <div className="space-y-3">
                    {quantity != null && quantity > 0 && (
                        <div>
                            <div className="text-sm font-medium text-gray-600">Quantity</div>
                            <div className="text-sm text-gray-900">{quantity}</div>
                        </div>
                    )}
                    {(() => {
                        let brandsDisplay = '';
                        if (Array.isArray(brands) && brands.length > 0) {
                            brandsDisplay = brands.join(', ');
                        } else if (typeof brands === 'string' && brands.trim()) {
                            brandsDisplay = brands;
                        }
                        return brandsDisplay ? (
                            <div>
                                <div className="text-sm font-medium text-gray-600">Brands</div>
                                <div className="text-sm text-gray-900">{brandsDisplay}</div>
                            </div>
                        ) : null;
                    })()}
                    {budget_per_unit != null && budget_per_unit > 0 && (
                        <div>
                            <div className="text-sm font-medium text-gray-600">Budget per Unit</div>
                            <div className="text-sm text-gray-900">${budget_per_unit}</div>
                        </div>
                    )}
                    {delivery_deadline && (
                        <div>
                            <div className="text-sm font-medium text-gray-600">Delivery Deadline</div>
                            <div className="text-sm text-gray-900">{delivery_deadline}</div>
                        </div>
                    )}
                    {location && (
                        <div>
                            <div className="text-sm font-medium text-gray-600">Location</div>
                            <div className="text-sm text-gray-900">{location}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}