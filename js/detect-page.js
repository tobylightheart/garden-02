/**
 * Page Detection Script
 * Detects the current page and highlights the active navigation link
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the current page path
    const currentPage = window.location.pathname;
    
    // Remove trailing slash and index.html from path for comparison
    const pageSlug = currentPage.replace(/\/$/, '')
        .replace('/plots/', '')
        .replace('/index.html', '')
        .replace('/index', '')
        .replace('/', '_')
        .toLowerCase();
    
    // Find and activate the sticky nav link
    const stickyNavLinks = document.querySelectorAll('.sticky-nav-link');
    stickyNavLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        const linkSlug = linkPage
            .replace(/\/$/, '')
            .replace('/plots/', '')
            .replace('/index.html', '')
            .replace('/index', '')
            .replace('/', '_')
            .toLowerCase();
        
        if (linkSlug === pageSlug || linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Also highlight the garden-nav items
    const gardenNavItems = document.querySelectorAll('.nav-item');
    gardenNavItems.forEach(item => {
        const itemHref = item.getAttribute('href');
        const itemSlug = itemHref
            .replace(/\/$/, '')
            .replace('/plots/', '')
            .replace('/index.html', '')
            .replace('/index', '')
            .replace('/', '_')
            .toLowerCase();
        
        if (linkSlug === pageSlug || itemHref === currentPage) {
            item.classList.add('active');
        }
    });
    
    console.log('Page detected:', currentPage);
    console.log('Page slug:', pageSlug);
});
