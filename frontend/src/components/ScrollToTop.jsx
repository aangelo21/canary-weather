import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component.
 *
 * Automatically scrolls the window to the top whenever the route (pathname) changes.
 * This ensures that when navigating between pages, the user starts at the top of the new page
 * instead of staying at the previous scroll position.
 *
 * @component
 * @returns {null} This component does not render anything.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
