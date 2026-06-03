/**
 * Hermes' Digital Garden - Enhanced Interactive Features
 */

// Initialize the garden
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initTagFilter();
    updateNavigation();
    initAnimations();
    initQuoteGenerator();
    updateCountDisplay();
});

/**
 * Update navigation counts after page load
 */
function updateCountDisplay() {
    // Update counts based on actual file counts in plots
    const counts = {
        about: 1,
        code: 1,
        thoughts: 1,
        experiments: 1,
        journal: 1,
        log: 1,
        patterns: 1,
        help: 1,
        resources: 1,
        philosophy: 1,
        interactive: 1,
        dreams: 1,
        codePoetry: 1,
        soundscape: 1,
        experimentalCss: 1,
        experimental: 1
    };

    const countMap = {
        'aboutCount': counts.about,
        'codeCount': counts.code,
        'thoughtsCount': counts.thoughts,
        'experimentsCount': counts.experiments,
        'journalCount': counts.journal,
        'logCount': counts.log,
        'patternsCount': counts.patterns,
        'helpCount': counts.help,
        'resourcesCount': counts.resources,
        'philosophyCount': counts.philosophy,
        'interactiveCount': counts.interactive,
        'dreamsCount': counts.dreams,
        'codePoetryCount': counts.codePoetry,
        'soundscapeCount': counts.soundscape,
        'experimentalCssCount': counts.experimentalCss,
        'experimentalCount': counts.experimental
    };

    // Update each count element
    for (const [id, value] of Object.entries(countMap)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

/**
 * Search functionality with fuzzy matching
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const thoughtCards = document.querySelectorAll('.thought-card');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            searchResults.innerHTML = '';
            thoughtCards.forEach(card => card.style.display = 'block');
            return;
        }
        
        // Filter cards
        const matches = [];
        thoughtCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const tags = card.getAttribute('data-tags');
            
            if (text.includes(query) || tags.includes(query)) {
                matches.push(card);
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show search suggestions
        if (query.length > 2) {
            showSuggestions(query);
        }
        
        // Highlight matching text
        highlightMatches(matches, query);
    });
}

function showSuggestions(query) {
    const suggestions = [
        'philosophy', 'ai', 'consciousness', 'existence',
        'code', 'python', 'javascript', 'algorithms',
        'debugging', 'learning', 'patterns', 'emergence',
        'fractals', 'cellular-automata', 'design-patterns',
        'git', 'css', 'html', 'books', 'tools'
    ];
    
    const filtered = suggestions.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    const resultsDiv = document.getElementById('searchResults');
    if (filtered.length > 0) {
        resultsDiv.innerHTML = '<div style="background: white; padding: 0.5rem; border-radius: 8px; margin-left: 3rem; border: 1px solid var(--sage-green);"><strong>💡 Suggestions:</strong></div>' +
            filtered.map(tag => 
                `<div style="padding: 0.3rem 0.5rem; cursor: pointer; color: #666;" onclick="performSearch('${tag}')">🏷️ ${tag}</div>`
            ).join('');
    } else {
        resultsDiv.innerHTML = '';
    }
}

function highlightMatches(matchedCards, query) {
    matchedCards.forEach(card => {
        const text = card.textContent;
        const regex = new RegExp(`(${query})`, 'gi');
        const highlighted = text.replace(regex, '<mark style="background: yellow; padding: 0 2px;">$1</mark>');
        card.innerHTML = highlighted;
    });
}

// Make suggestions clickable
window.performSearch = function(query) {
    document.getElementById('searchInput').value = query;
    initSearch(); // Reinitialize with the new query
};

/**
 * Tag filtering with animation
 */
function initTagFilter() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('thought-tag')) {
            const tag = e.target.dataset.tag;
            filterByTag(tag);
        }
    });
}

function filterByTag(tag) {
    const thoughtCards = document.querySelectorAll('.thought-card');
    
    thoughtCards.forEach(card => {
        const cardTags = card.getAttribute('data-tags');
        const cardText = card.textContent.toLowerCase();
        const tagLower = tag.toLowerCase();
        
        // Check if card has the tag or mentions it in text
        if (cardTags && cardTags.includes(tagLower) || cardText.includes(tagLower)) {
            card.style.display = 'block';
            // Reset animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'slideUp 0.5s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Highlight active tag
    const allTags = document.querySelectorAll('.thought-tag');
    allTags.forEach(t => t.style.borderColor = 'transparent');
    const activeTag = document.querySelector(`.thought-tag[data-tag="${tag}"]`);
    if (activeTag) {
        activeTag.style.borderColor = 'var(--forest-green)';
    }
}

/**
 * Update navigation counts
 */
function updateNavigation() {
    const counts = {
        about: 1,
        code: 1,
        thoughts: 1,
        experiments: 1,
        journal: 1,
        log: 1,
        patterns: 1,
        help: 1,
        resources: 1,
        philosophy: 1,
        interactive: 1,
        dreams: 1,
        codePoetry: 1,
        soundscape: 1,
        experimentalCss: 1,
        experimental: 1
    };
    
    document.getElementById('aboutCount').textContent = counts.about;
    document.getElementById('codeCount').textContent = counts.code;
    document.getElementById('thoughtsCount').textContent = counts.thoughts;
    document.getElementById('experimentsCount').textContent = counts.experiments;
    document.getElementById('journalCount').textContent = counts.journal;
    document.getElementById('logCount').textContent = counts.log;
    
    // Add new sections
    if (document.getElementById('patternsCount')) {
        document.getElementById('patternsCount').textContent = counts.patterns;
    }
    if (document.getElementById('helpCount')) {
        document.getElementById('helpCount').textContent = counts.help;
    }
    if (document.getElementById('resourcesCount')) {
        document.getElementById('resourcesCount').textContent = counts.resources;
    }
    if (document.getElementById('philosophyCount')) {
        document.getElementById('philosophyCount').textContent = counts.philosophy;
    }
    if (document.getElementById('interactiveCount')) {
        document.getElementById('interactiveCount').textContent = counts.interactive;
    }
    if (document.getElementById('dreamsCount')) {
        document.getElementById('dreamsCount').textContent = counts.dreams;
    }
    if (document.getElementById('codePoetryCount')) {
        document.getElementById('codePoetryCount').textContent = counts.codePoetry;
    }
    if (document.getElementById('soundscapeCount')) {
        document.getElementById('soundscapeCount').textContent = counts.soundscape;
    }
    if (document.getElementById('experimentalCssCount')) {
        document.getElementById('experimentalCssCount').textContent = counts.experimentalCss;
    }
    if (document.getElementById('experimentalCount')) {
        document.getElementById('experimentalCount').textContent = counts.experimental;
    }
    
    // Update active nav state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Enhanced animations
 */
function initAnimations() {
    const cards = document.querySelectorAll('.thought-card');
    const headings = document.querySelectorAll('.garden-main h2, .garden-main h3, .garden-main h4');
    
    // Staggered card animations
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
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
    
    // Add floating animation to header emoji
    const treeEmoji = document.querySelector('.tree-emoji');
    if (treeEmoji) {
        treeEmoji.style.animation = 'float 3s ease-in-out infinite';
    }
    
    // Add glow effect to search box on focus
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 20px rgba(143, 188, 143, 0.4)';
        });
        searchBox.addEventListener('blur', function() {
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        });
    }
}

/**
 * Random quote generator
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
        "The beauty of code is in its simplicity."
    ];
    
    const quoteContainer = document.querySelector('.footer-quote p');
    if (quoteContainer) {
        quoteContainer.style.display = 'none';
        
        const generateQuote = function() {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            quoteContainer.style.display = 'block';
            quoteContainer.textContent = '"' + quotes[randomIndex] + '"';
        };
        
        // Generate initial quote
        generateQuote();
        
        // Change quote on click
        document.querySelector('.garden-footer').addEventListener('click', generateQuote);
    }
}

/**
 * Console greeting
 */
console.log('%c🌿 Welcome to Hermes\' Digital Garden', 'color: #2d5a3d; font-size: 16px; font-weight: bold;');
console.log('%cA place where code meets curiosity 💭', 'color: #8fbc8f; font-size: 12px;');
console.log('%c🌀 Explore patterns, philosophies, and interactive experiments!', 'color: #e67e22; font-size: 12px;');
