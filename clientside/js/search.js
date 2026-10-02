// ============================================================
// search.js
// Search page logic:
// 1. Loads event categories from GET /api/categories to fill
//    the category dropdown.
// 2. Sends the search form criteria to GET /api/events/search
//    and renders the matching events.
// 3. "Clear Filters" resets the form (basic DOM manipulation).
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  document.getElementById('search-form').addEventListener('submit', handleSearch);
  document.getElementById('clear-filters').addEventListener('click', clearFilters);
});

// ------------------------------------------------------------
// Populate the category dropdown from the API
// ------------------------------------------------------------
async function loadCategories() {
  const select = document.getElementById('search-category');
  try {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error(`API status ${response.status}`);

    const categories = await response.json();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.category_id;
      option.textContent = category.category_name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Failed to load categories:', error);
    showError('Could not load event categories. Please make sure the API server is running.');
  }
}

// ------------------------------------------------------------
// Handle the search form submission
// ------------------------------------------------------------
async function handleSearch(event) {
  event.preventDefault(); // Stop the form from reloading the page

  const date = document.getElementById('search-date').value;
  const location = document.getElementById('search-location').value.trim();
  const category = document.getElementById('search-category').value;

  // Basic validation: at least one criterion must be provided
  if (!date && !location && !category) {
    showError('Please select at least one search criterion (date, location or category).');
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  // Build the query string for GET /api/events/search
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (location) params.append('location', location);
  if (category) params.append('category', category);

  try {
    const response = await fetch(`${API_BASE}/events/search?${params.toString()}`);
    if (!response.ok) throw new Error(`API status ${response.status}`);

    const events = await response.json();

    if (events.length === 0) {
      hideError();
      document.getElementById('search-results').innerHTML =
        '<p class="loading-text">No events matched your search criteria. Try widening your filters.</p>';
      return;
    }

    hideError();
    renderResults(events);
  } catch (error) {
    console.error('Search failed:', error);
    showError('Sorry, the search failed. Please make sure the API server is running and try again.');
  }
}

// ------------------------------------------------------------
// Clear Filters button: resets all form fields and results
// ------------------------------------------------------------
function clearFilters() {
  document.getElementById('search-date').value = '';
  document.getElementById('search-location').value = '';
  document.getElementById('search-category').value = '';
  document.getElementById('search-results').innerHTML = '';
  hideError();
}

// ------------------------------------------------------------
// Render helpers (DOM manipulation)
// ------------------------------------------------------------
function renderResults(events) {
  const results = document.getElementById('search-results');

  const cards = events.map(event => {
    const date = new Date(event.event_date + 'T00:00:00');
    const dateStr = date.toLocaleDateString('en-AU', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
    const priceStr = Number(event.ticket_price) === 0
      ? 'Free entry'
      : `$${Number(event.ticket_price).toFixed(2)}`;

    return `
      <article class="event-card">
        <div class="event-card-header">
          <span class="category-badge">${event.category_name}</span>
          <span class="event-price ${Number(event.ticket_price) === 0 ? 'free' : ''}">${priceStr}</span>
        </div>
        <h3 class="event-title">${event.event_name}</h3>
        <p class="event-meta">&#128197; ${dateStr}</p>
        <p class="event-meta">&#128205; ${event.location_venue}, ${event.location_city}</p>
        <a class="btn btn-outline" href="event-detail.html?event_id=${event.event_id}">View details</a>
      </article>
    `;
  }).join('');

  results.innerHTML = cards;
}

function showError(message) {
  const errorBox = document.getElementById('search-error');
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}

function hideError() {
  document.getElementById('search-error').classList.add('hidden');
}
