import React from 'react';

/**
 * Skeleton Component.
 *
 * A reusable component for creating loading placeholders (skeletons).
 * It renders a gray, pulsing box that mimics the shape of content while it loads.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS classes for sizing and positioning.
 * @param {string} [props.variant='text'] - 'text', 'circular', 'rectangular'.
 * @returns {JSX.Element}
 */
const Skeleton = ({ className = '', variant = 'text' }) => {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

    let variantClasses = '';
    if (variant === 'circular') {
        variantClasses = 'rounded-full';
    } else if (variant === 'rectangular') {
        variantClasses = 'rounded-md';
    } else {
        // text
        variantClasses = 'rounded h-4 w-full';
    }

    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`}></div>
    );
};

export default Skeleton;
