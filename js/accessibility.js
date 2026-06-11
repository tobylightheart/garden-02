/**
 * Hermes' Digital Garden - Accessibility Enhancements
 * ARIA labels, keyboard navigation, screen reader support
 */

document.addEventListener('DOMContentLoaded', function() {
    initARIALabels();
    initKeyboardNavigation();
    initScreenReaderAnnouncements();
    initFocusManagement();
    initReducedMotion();
    initHighContrast();
});

/**
 * Add ARIA labels to interactive elements
 */
function initARIALabels() {
    // Add ARIA labels to search
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        searchInput.setAttribute('aria-label', 'Search the digital garden');
        searchInput.setAttribute('role', 'searchbox');
        searchInput.setAttribute('aria-describedby', 'searchHelp');
        
        const searchHelp = document.createElement('span');
        searchHelp.id = 'searchHelp';
        searchHelp.setAttribute('aria-hidden', 'true');
        searchHelp.style.cssText = 'display: none;';
        searchHelp.textContent = 'Type to search garden content';
        searchInput.parentElement.appendChild(searchHelp);
    }
    
    if (searchResults) {
        searchResults.setAttribute('role', 'searchresults');
        searchResults.setAttribute('aria-live', 'polite');
        searchResults.setAttribute('aria-relevant', 'additions removals');
    }
    
    // Add ARIA labels to navigation
    const navLinks = document.querySelectorAll('.sticky-nav-link, .nav-item');
    navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const label = link.textContent.trim();
        
        link.setAttribute('aria-label', `${index + 1}. ${label}, navigate to ${href}`);
        
        if (link.getAttribute('role') !== 'button') {
            link.setAttribute('role', 'link');
        }
    });
    
    // Add ARIA labels to thought cards
    const thoughtCards = document.querySelectorAll('.thought-card');
    thoughtCards.forEach((card, index) => {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        const tags = card.getAttribute('data-tags') || '';
        
        const ariaLabel = title ? title.textContent : card.textContent.substring(0, 100);
        card.setAttribute('aria-labelledby', `thought-title-${index}`);
        
        // Add role for screen readers
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `${ariaLabel}, tags: ${tags}`);
    });
    
    // Add ARIA labels to tags
    const tags = document.querySelectorAll('.thought-tag');
    tags.forEach((tag, index) => {
        const tagText = tag.textContent;
        tag.setAttribute('aria-label', `Filter by tag: ${tagText}`);
        tag.setAttribute('role', 'button');
        tag.setAttribute('tabindex', '0');
    });
    
    // Add ARIA landmarks
    const gardenContainer = document.querySelector('.garden-container');
    if (gardenContainer) {
        gardenContainer.setAttribute('role', 'application');
        gardenContainer.setAttribute('aria-label', 'Hermes Digital Garden - a collection of thoughts, code, and experiments');
    }
    
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.setAttribute('aria-label', 'Skip to main content');
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--sage-green);
        color: white;
        padding: 8px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const mainContent = document.querySelector('.garden-main');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
        mainContent.setAttribute('aria-label', 'Main content area');
    }
}

/**
 * Keyboard navigation improvements
 */
function initKeyboardNavigation() {
    // Arrow key navigation in thought grid
    const thoughtGrid = document.getElementById('thoughtGrid');
    let focusedCard = null;
    let cardIndex = -1;
    
    thoughtGrid.addEventListener('keydown', function(e) {
        const cards = Array.from(document.querySelectorAll('.thought-card'));
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (cardIndex < cards.length - 1) {
                    cards[cardIndex].classList.remove('keyboard-focused');
                    cardIndex++;
                    cards[cardIndex].focus();
                    cards[cardIndex].classList.add('keyboard-focused');
                    
                    // Smooth scroll into view
                    cards[cardIndex].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (cardIndex > 0) {
                    cards[cardIndex].classList.remove('keyboard-focused');
                    cardIndex--;
                    cards[cardIndex].focus();
                    cards[cardIndex].classList.add('keyboard-focused');
                    
                    // Smooth scroll into view
                    cards[cardIndex].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
                break;
                
            case 'ArrowRight':
                e.preventDefault();
                if (cardIndex < cards.length - 1) {
                    cards[cardIndex].scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'near'
                    });
                    cardIndex++;
                }
                break;
                
            case 'ArrowLeft':
                e.preventDefault();
                if (cardIndex > 0) {
                    cardIndex--;
                }
                break;
                
            case 'Home':
                e.preventDefault();
                if (cards.length > 0) {
                    cards[0].focus();
                    cards[0].scrollIntoView({ behavior: 'smooth' });
                    cardIndex = 0;
                }
                break;
                
            case 'End':
                e.preventDefault();
                if (cards.length > 0) {
                    cards[cards.length - 1].focus();
                    cards[cards.length - 1].scrollIntoView({ behavior: 'smooth' });
                    cardIndex = cards.length - 1;
                }
                break;
                
            case 'Enter':
            case ' ':
                if (focusedCard) {
                    e.preventDefault();
                    const link = focusedCard.querySelector('.read-more');
                    if (link) {
                        link.click();
                    }
                }
                break;
                
            case 'Escape':
                // Clear search
                const searchInput = document.getElementById('searchInput');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    initSearch();
                }
                break;
        }
    });
    
    // Add keyboard focus styles
    const style = document.createElement('style');
    style.textContent = `
        .thought-card[tabindex="0"],
        .thought-card:focus {
            outline: 3px solid var(--sage-green);
            outline-offset: 2px;
        }
        
        .thought-card.keyboard-focused {
            border: 3px solid var(--sage-green);
            box-shadow: 0 0 20px rgba(143, 188, 143, 0.5);
        }
        
        .skip-link {
            text-decoration: none;
        }
        
        *:focus:not(:focus-visible) {
            outline: none;
        }
        
        *:focus-visible {
            outline: 3px solid var(--sage-green);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Screen reader announcements
 */
function initScreenReaderAnnouncements() {
    // Create live region for announcements
    const announcementRegion = document.createElement('div');
    announcementRegion.setAttribute('aria-live', 'assertive');
    announcementRegion.setAttribute('aria-atomic', 'true');
    announcementRegion.setAttribute('class', 'sr-only');
    announcementRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
    announcementRegion.id = 'sr-announcements';
    document.body.appendChild(announcementRegion);
    
    // Announce search results
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    if (searchResults && searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const visibleCards = document.querySelectorAll('.thought-card[style*="display: block"]');
            const hiddenCards = document.querySelectorAll('.thought-card[style*="display: none"]');
            
            if (query.length > 2) {
                if (visibleCards.length > 0) {
                    announcementRegion.textContent = `Found ${visibleCards.length} result${visibleCards.length > 1 ? 's' : ''} for "${query}"`;
                } else {
                    announcementRegion.textContent = `No results found for "${query}"`;
                }
            } else {
                announcementRegion.textContent = '';
            }
        });
    }
    
    // Announce tag filter changes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('thought-tag')) {
            const tag = e.target.dataset.tag;
            const visibleCards = document.querySelectorAll('.thought-card[style*="display: block"]');
            announcementRegion.textContent = `Filtered by tag "${tag}". ${visibleCards.length} result${visibleCards.length > 1 ? 's' : ''} shown`;
        }
    });
}

/**
 * Focus management for smooth transitions
 */
function initFocusManagement() {
    // Manage focus when navigating
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Restore focus on modal close (if implemented in future)
    window.addEventListener('beforeunload', function() {
        // Reset focus states
        document.querySelectorAll('.thought-card').forEach(card => {
            card.classList.remove('keyboard-focused');
        });
    });
}

/**
 * Respect user's reduced motion preference
 */
function initReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (mediaQuery.matches) {
        // Disable animations
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        
        // Remove animation from elements
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
    }
    
    mediaQuery.addEventListener('change', function(e) {
        if (e.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    });
}

/**
 * High contrast mode support
 */
function initHighContrast() {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    if (mediaQuery.matches) {
        const root = document.documentElement;
        root.style.setProperty('--sage-green', '#90EE90');
        root.style.setProperty('--forest-green', '#006400');
        root.style.setProperty('--text-primary', '#000000');
        root.style.setProperty('--text-secondary', '#333333');
        root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.8)');
    }
    
    mediaQuery.addEventListener('change', function(e) {
        if (e.matches) {
            const root = document.documentElement;
            root.style.setProperty('--sage-green', '#90EE90');
            root.style.setProperty('--forest-green', '#006400');
            root.style.setProperty('--text-primary', '#000000');
            root.style.setProperty('--text-secondary', '#333333');
            root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.8)');
        }
    });
}

/**
 * Announce page load to screen readers
 */
function announcePageLoad() {
    const announcementRegion = document.getElementById('sr-announcements');
    if (announcementRegion) {
        setTimeout(function() {
            announcementRegion.textContent = 'Welcome to Hermes Digital Garden. Press Tab to navigate. Use Search to find content.';
        }, 500);
    }
}

// Trigger page load announcement
setTimeout(announcePageLoad, 1000);
