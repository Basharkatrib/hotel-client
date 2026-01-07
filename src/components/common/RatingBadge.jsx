import React from 'react';
import { FaStar } from 'react-icons/fa';

const RatingBadge = ({ rating, reviewsCount, size = 'md', showText = true, className = "" }) => {
    const numericRating = Number(rating);

    if (isNaN(numericRating) || numericRating <= 0) return null;

    const getRatingLabel = (score) => {
        // Normalizing 5-scale to 10-scale logic just for labels if needed, 
        // but here we use 5-scale directly.
        if (score >= 4.7) return 'Exceptional';
        if (score >= 4.5) return 'Superb';
        if (score >= 4.0) return 'Very Good';
        if (score >= 3.5) return 'Good';
        if (score >= 3.0) return 'Pleasant';
        return 'Fair';
    };

    const getRatingColor = (score) => {
        if (score >= 4.5) return 'bg-blue-900 dark:bg-blue-800'; // Superb
        if (score >= 4.0) return 'bg-blue-700 dark:bg-blue-600'; // Very Good
        if (score >= 3.5) return 'bg-blue-600 dark:bg-blue-500'; // Good
        return 'bg-gray-500 dark:bg-gray-600'; // Fair/Poor
    };

    const label = getRatingLabel(numericRating);
    const bgColor = getRatingColor(numericRating);

    const sizeStyles = {
        sm: {
            badge: 'px-1.5 py-0.5 text-[10px] rounded-md',
            label: 'text-[11px]',
            count: 'text-[10px]',
            gap: 'gap-1.5'
        },
        md: {
            badge: 'px-2 py-1 text-xs rounded-lg',
            label: 'text-xs font-bold',
            count: 'text-[11px]',
            gap: 'gap-2.5'
        },
        lg: {
            badge: 'px-2.5 py-1.5 text-sm rounded-xl',
            label: 'text-sm font-extrabold',
            count: 'text-xs',
            gap: 'gap-3'
        }
    };

    const currentSize = sizeStyles[size] || sizeStyles.md;

    return (
        <div className={`flex items-center ${currentSize.gap} ${className}`}>
            {showText && (
                <div className="flex flex-col items-end leading-tight">
                    <span className={`text-gray-900 dark:text-white capitalize ${currentSize.label}`}>
                        {label}
                    </span>
                    {reviewsCount !== undefined && (
                        <span className={`text-gray-500 dark:text-gray-400 font-medium ${currentSize.count}`}>
                            {reviewsCount.toLocaleString()} reviews
                        </span>
                    )}
                </div>
            )}
            <div className={`flex items-center justify-center font-bold text-white shadow-sm ${bgColor} ${currentSize.badge}`}>
                {numericRating.toFixed(1)}
            </div>
        </div>
    );
};

export default RatingBadge;
