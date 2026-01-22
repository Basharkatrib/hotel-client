import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Automatically scrolls to top of page on route change
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top smoothly on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // يمكنك تغييرها إلى 'auto' للتمرير الفوري
        });
    }, [pathname]); // يتم التنفيذ عند تغيير المسار

    return null; // هذا المكون لا يعرض شيئاً
};

export default ScrollToTop;
