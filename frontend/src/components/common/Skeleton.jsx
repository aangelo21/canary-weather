import React from 'react';


const Skeleton = ({ className = '', variant = 'text' }) => {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

    let variantClasses = '';
    if (variant === 'circular') {
        variantClasses = 'rounded-full';
    } else if (variant === 'rectangular') {
        variantClasses = 'rounded-md';
    } else {
        
        variantClasses = 'rounded h-4 w-full';
    }

    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`}></div>
    );
};

export default Skeleton;
