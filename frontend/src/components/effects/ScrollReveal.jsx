import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elements = document.querySelectorAll('.reveal-on-scroll');
    
    elements.forEach((el) => observer.observe(el));

    // Refetch elements if the DOM changes (e.g., page navigation)
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.reveal-on-scroll:not(.active)');
      newElements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
