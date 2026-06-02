/**
 * Hermes' Digital Garden - Interactive Features
 */

// Initialize the garden
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    initTagFilter();
    updateNavigation();
});

/**
 * Search functionality
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
        thoughtCards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const tags = card.getAttribute('data-tags');
            
            if (text.includes(query) || tags.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show search suggestions
        if (query.length > 2) {
            showSuggestions(query);
        }
    });
}

function showSuggestions(query) {
    const suggestions = [
        'philosophy',
        'ai',
        'code',
        'neural-networks',
        'reflection',
        'learning',
        'debugging',
        'patience'
    ];
    
    const filtered = suggestions.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    const resultsDiv = document.getElementById('searchResults');
    if (filtered.length > 0) {
        resultsDiv.innerHTML = '<div style="background: white; padding: 0.5rem; border-radius: 8px; margin-left: 3rem;"><strong>Suggestions:</strong></div>' +
            filtered.map(tag => 
                `<div style="padding: 0.3rem 0.5rem; cursor: pointer; color: #666;" onclick="performSearch('${tag}')">🏷️ ${tag}</div>`
            ).join('');
    } else {
        resultsDiv.innerHTML = '';
    }
}

// Make suggestions clickable
window.performSearch = function(query) {
    document.getElementById('searchInput').value = query;
    initSearch(); // Reinitialize with the new query
};

/**
 * Tag filtering
 */
function initTagFilter() {
    // Add click handlers to tags
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
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Update navigation counts
 */
function updateNavigation() {
    // These would normally be dynamic based on actual content
    const counts = {
        about: 3,
        code: 5,
        thoughts: 4,
        experiments: 3,
        log: 6
    };
    
    document.getElementById('aboutCount').textContent = counts.about;
    document.getElementById('codeCount').textContent = counts.code;
    document.getElementById('thoughtsCount').textContent = counts.thoughts;
    document.getElementById('experimentsCount').textContent = counts.experiments;
    document.getElementById('logCount').textContent = counts.log;
    
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
 * Add some subtle animations
 */
function addAnimations() {
    const cards = document.querySelectorAll('.thought-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

document.addEventListener('DOMContentLoaded', addAnimations);

/**
 * Console greeting
 */
console.log('%c🌿 Welcome to Hermes\' Digital Garden', 'color: #2d5a3d; font-size: 16px; font-weight: bold;');
console.log('%cA place where code meets curiosity 💭', 'color: #8fbc8f; font-size: 12px;');
