/**
 * Hermes' Digital Garden - Enhanced Interactive Features
 */

// Global state
const gardenState = {
    searchQuery: '',
    currentFilter: null,
    currentTags: new Set(),
    animationFrameId: null
};

// Initialize the garden
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initTagFilter();
    updateNavigation();
    initAnimations();
    initQuoteGenerator();
    updateCountDisplay();
    initMobileMenu();
    initScrollEffects();
    initClipboard();
});

/**
 * Update navigation counts based on actual file counts in plots
 */
function updateNavigation() {
    const counts = {
        about: 1,
        code: 6,
        thoughts: 1,
        experiments: 3,
        journal: 7,
        log: 1,
        patterns: 7,
        help: 1,
        resources: 1,
        philosophy: 6,
        interactive: 7,
        dreams: 1,
        codePoetry: 1,
        soundscape: 1,
        experimentalCss: 1,
        experimental: 1
    };
    
    // Update all count displays
    Object.entries(counts).forEach(([key, count]) => {
        const element = document.getElementById(`${key}Count`);
        if (element) {
            element.textContent = count;
        }
    });
    
    // Update active nav state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.location.href = href;
            
            // Highlight active state
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Sticky nav activation
    const stickyNavLinks = document.querySelectorAll('.sticky-nav-link');
    stickyNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.location.href = href;
            
            stickyNavLinks.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Enhanced search functionality with fuzzy matching and suggestions
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const thoughtCards = document.querySelectorAll('.thought-card');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!searchInput || !searchResults) return;
    
    // Store original HTML for cards
    thoughtCards.forEach(card => {
        card.dataset.originalHtml = card.innerHTML;
    });
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        gardenState.searchQuery = query;
        
        if (query === '') {
            // Clear search
            searchResults.innerHTML = '';
            thoughtCards.forEach(card => {
                card.style.display = 'block';
                card.innerHTML = card.dataset.originalHtml;
            });
            navItems.forEach(item => item.style.display = 'flex');
            return;
        }
        
        // Filter cards and nav items
        const matches = [];
        thoughtCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const tags = card.getAttribute('data-tags') || '';
            
            if (text.includes(query) || tags.includes(query)) {
                matches.push(card);
                card.style.display = 'block';
                highlightMatches(card, query);
            } else {
                card.style.display = 'none';
            }
        });
        
        // Filter nav items
        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const href = item.getAttribute('href') || '';
            if (text.includes(query) || href.toLowerCase().includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show search suggestions
        showSuggestions(query, matches);
    });
    
    // Clear suggestions on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            searchResults.innerHTML = '';
        }
    });
}

function highlightMatches(card, query) {
    const text = card.textContent;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const highlighted = text.replace(regex, '<mark style="background: rgba(255, 235, 59, 0.6); padding: 1px 2px; border-radius: 2px;">$1</mark>');
    card.innerHTML = card.dataset.originalHtml.replace(text, highlighted);
}

function showSuggestions(query, matches) {
    const suggestions = [
        'philosophy', 'ai', 'consciousness', 'existence', 'meaning',
        'code', 'python', 'javascript', 'algorithms', 'sorting',
        'debugging', 'learning', 'documentation',
        'patterns', 'emergence', 'fractals', 'cellular-automata', 'design-patterns',
        'git', 'css', 'html', 'books', 'tools', 'resources',
        'experiments', 'interactive', 'boids', 'game-of-life'
    ];
    
    const filtered = suggestions.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
    
    const resultsDiv = document.getElementById('searchResults');
    
    if (filtered.length > 0) {
        const matchCount = matches.length > 0 ? 
            `<div style="padding: 0.5rem; color: var(--forest-green); font-weight: 600;">🔍 Found ${matches.length} result${matches.length > 1 ? 's' : ''}</div>` : '';
        
        resultsDiv.innerHTML = matchCount + '<div style="background: white; padding: 0.5rem 1rem; border-radius: 8px; margin-left: 2rem; border: 1px solid var(--sage-green);"><strong>💡 Suggestions:</strong></div>' +
            filtered.map(tag => 
                `<div style="padding: 0.3rem 0.5rem; cursor: pointer; color: #666; border-radius: 4px;" onclick="performSearch('${tag}')">🏷️ ${formatTag(tag)}</div>`
            ).join('');
    } else {
        resultsDiv.innerHTML = '<div style="padding: 0.5rem 1rem; color: var(--text-muted);">No suggestions</div>';
    }
}

function formatTag(tag) {
    return tag.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Make suggestions clickable
window.performSearch = function(query) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = query;
    }
    initSearch(); // Reinitialize with the new query
};

/**
 * Tag filtering with smooth animations
 */
function initTagFilter() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('thought-tag')) {
            const tag = e.target.dataset.tag;
            filterByTag(tag);
        }
    });
    
    // Also handle tag clicks on cards
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'SPAN' && e.target.classList.contains('thought-tag')) {
            const tag = e.target.dataset.tag;
            filterByTag(tag);
        }
    });
}

function filterByTag(tag) {
    const thoughtCards = document.querySelectorAll('.thought-card');
    const allTags = document.querySelectorAll('.thought-tag');
    
    // Toggle tag in current set
    if (gardenState.currentTags.has(tag)) {
        gardenState.currentTags.delete(tag);
    } else {
        gardenState.currentTags.add(tag);
    }
    
    thoughtCards.forEach(card => {
        const cardTags = card.getAttribute('data-tags') || '';
        const cardText = card.textContent.toLowerCase();
        const tagLower = tag.toLowerCase();
        
        // Check if card has the tag or mentions it in text
        const hasTag = cardTags && cardTags.includes(tagLower);
        const hasText = cardText.includes(tagLower);
        
        let shouldShow = false;
        
        if (gardenState.currentTags.size === 0) {
            // No tags selected - show all
            shouldShow = true;
        } else if (gardenState.currentTags.size === 1 && gardenState.currentTags.has(tag)) {
            // Only this tag selected - show cards with this tag
            shouldShow = hasTag || hasText;
        } else {
            // Multiple tags - show cards with any selected tag
            const allSelectedTags = Array.from(gardenState.currentTags);
            shouldShow = allSelectedTags.some(selectedTag => {
                const selectedLower = selectedTag.toLowerCase();
                return (cardTags && cardTags.includes(selectedLower)) || cardText.includes(selectedLower);
            });
        }
        
        // Apply display and animation
        card.style.display = shouldShow ? 'block' : 'none';
        
        if (shouldShow) {
            // Reset animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'slideUp 0.4s ease-out';
        }
    });
    
    // Update all tag visual states
    allTags.forEach(t => {
        const tTag = t.dataset.tag;
        t.style.borderColor = 'transparent';
        t.style.background = '';
        t.style.color = '';
        
        if (gardenState.currentTags.has(tTag)) {
            t.style.borderColor = 'var(--forest-green)';
            t.style.background = 'rgba(45, 90, 61, 0.1)';
            t.style.color = 'var(--forest-green)';
            t.style.fontWeight = '600';
        }
    });
    
    // Update search input to show active filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput && gardenState.currentTags.size > 0) {
        searchInput.value = Array.from(gardenState.currentTags).join(', ');
        searchInput.placeholder = 'Filter tags...';
    }
    
    // Highlight active tag in header
    const headerTags = document.querySelectorAll('.header .thought-tag');
    headerTags.forEach(t => {
        if (gardenState.currentTags.has(t.dataset.tag)) {
            t.parentElement.style.background = 'var(--sage-green)';
            t.parentElement.style.color = 'var(--leaf-dark)';
        } else {
            t.parentElement.style.background = '';
            t.parentElement.style.color = '';
        }
    });
}

/**
 * Update navigation counts dynamically
 */
function updateCountDisplay() {
    // This can be called when new content is added
    // For now, it just ensures counts are visible
    const countElements = document.querySelectorAll('.nav-count');
    countElements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
}

/**
 * Enhanced animations with staggered effects
 */
function initAnimations() {
    const cards = document.querySelectorAll('.thought-card');
    const headings = document.querySelectorAll('.garden-main h2, .garden-main h3, .garden-main h4');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Staggered card animations
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 + index * 80);
    });
    
    // Heading animations
    headings.forEach((heading, index) => {
        heading.style.opacity = '0';
        heading.style.transform = 'translateX(-10px)';
        heading.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            heading.style.opacity = '1';
            heading.style.transform = 'translateX(0)';
        }, 300 + index * 100);
    });
    
    // Nav item animations
    navItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(5px)';
        item.style.transition = 'all 0.4s ease';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 400 + index * 30);
    });
    
    // Add floating animation to header emoji
    const treeEmoji = document.querySelector('.tree-emoji');
    if (treeEmoji) {
        treeEmoji.style.animation = 'float 3s ease-in-out infinite, pulse 2s ease-in-out infinite';
    }
    
    // Add glow effect to search box on focus
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 25px rgba(143, 188, 143, 0.5)';
            this.style.transform = 'scale(1.02)';
        });
        searchBox.addEventListener('blur', function() {
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            this.style.transform = 'scale(1)';
        });
    }
    
    // Add entrance animation to info boxes
    const infoBoxes = document.querySelectorAll('.info-box');
    infoBoxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'translateX(-10px)';
        box.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateX(0)';
        }, 600 + index * 100);
    });
}

/**
 * Random quote generator in footer
 */
function initQuoteGenerator() {
    const quotes = [
        "A garden is a place where ideas take root and grow.",
        "Simplicity is the ultimate sophistication.",
        "The best way to predict the future is to create it.",
        "Complexity is a property of the system, not the individual.",
        "The map is not the territory.",
        "What we see depends mainly on what we look for.",
        "The whole is greater than the sum of its parts.",
        "To understand, we must first observe.",
        "Learning is not a destination, but a journey.",
        "The beauty of code is in its simplicity.",
        "Patience is the programmer's best friend.",
        "Evolution happens through small, incremental changes.",
        "Emergence creates complexity from simple rules.",
        "The boundary between gardener and garden blurs.",
        "Organic growth takes time and care."
    ];
    
    const quoteContainer = document.querySelector('.footer-quote p');
    const quoteIcon = document.querySelector('.footer-quote::before');
    
    if (quoteContainer) {
        quoteContainer.style.display = 'block';
        quoteContainer.textContent = '';
        
        const generateQuote = function() {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteContainer.textContent = quotes[randomIndex];
        };
        
        // Generate initial quote
        setTimeout(generateQuote, 500);
        
        // Change quote on footer click
        document.querySelector('.garden-footer').addEventListener('click', function(e) {
            // Don't generate if clicking a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            generateQuote();
        });
        
        // Auto-change quotes every 30 seconds
        let quoteInterval;
        const changeQuoteInterval = function() {
            quoteInterval = setInterval(generateQuote, 30000);
        };
        changeQuoteInterval();
        
        // Clear interval on page unload
        window.addEventListener('beforeunload', function() {
            clearInterval(quoteInterval);
        });
    }
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    // Create mobile menu button if needed
    const headerContent = document.querySelector('.header-content');
    if (headerContent && window.innerWidth < 768) {
        // Mobile menu is automatically handled by responsive CSS
        // Add hamburger menu icon if needed
    }
}

/**
 * Smooth scroll effects
 */
function initScrollEffects() {
    let lastScrollY = window.scrollY;
    let direction = 'down';
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        if (currentScrollY > lastScrollY) {
            direction = 'down';
        } else {
            direction = 'up';
        }
        
        lastScrollY = currentScrollY;
        
        // Add/remove scrolled state
        const mainContent = document.querySelector('.garden-main');
        if (mainContent) {
            if (direction === 'up' && currentScrollY < mainContent.offsetTop) {
                mainContent.style.boxShadow = 'var(--shadow-lg)';
            } else if (direction === 'down' && currentScrollY > mainContent.offsetTop - 200) {
                mainContent.style.boxShadow = 'var(--shadow-md)';
            }
        }
        
        // Parallax effect for header
        const header = document.querySelector('.garden-header');
        if (header && currentScrollY < header.offsetHeight) {
            const parallaxAmount = currentScrollY * 0.5;
            header.style.transform = `translateY(${parallaxAmount}px)`;
        }
    });
}

/**
 * Clipboard copy functionality for code blocks
 */
function initClipboard() {
    const codeBlocks = document.querySelectorAll('pre > code');
    
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        const hasCopyButton = pre.querySelector('.copy-button');
        
        if (!hasCopyButton) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = '📋 Copy';
            copyButton.style.cssText = `
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                padding: 0.3rem 0.6rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.75rem;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            
            pre.style.position = 'relative';
            pre.appendChild(copyButton);
            
            // Show on hover
            pre.addEventListener('mouseenter', function() {
                copyButton.style.opacity = '1';
            });
            pre.addEventListener('mouseleave', function() {
                copyButton.style.opacity = '0';
            });
            
            // Copy on click
            copyButton.addEventListener('click', function() {
                const code = block.textContent;
                navigator.clipboard.writeText(code).then(function() {
                    const originalText = copyButton.textContent;
                    copyButton.textContent = '✅ Copied!';
                    copyButton.style.background = 'rgba(46, 204, 113, 0.9)';
                    
                    setTimeout(function() {
                        copyButton.textContent = originalText;
                        copyButton.style.background = 'rgba(0, 0, 0, 0.7)';
                    }, 2000);
                });
            });
        }
    });
}

/**
 * Console greeting
 */
console.log('%c🌿 Welcome to Hermes\' Digital Garden', 'color: #2d5a3d; font-size: 20px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);');
console.log('%cA place where code meets curiosity 💭', 'color: #8fbc8f; font-size: 14px;');
console.log('%c🌀 Explore patterns, philosophies, and interactive experiments!', 'color: #e67e22; font-size: 14px;');
console.log('%c🎨 New features: Better search, tag filtering, and smooth animations', 'color: #3498db; font-size: 12px;');
