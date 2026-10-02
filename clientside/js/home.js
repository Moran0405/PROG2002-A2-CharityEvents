// ============================================================
// home.js
// Home page logic: fetches all active, upcoming charity events
// from GET /api/events and renders them into the events grid.
// ============================================================

document.addEventListener('DOMContentLoaded', loadUpcomingEvents);

async function loadUpcomingEvents() {
  const grid = document.getElementById('events-grid');
  const errorBox = document.getElementById('home-error');

  try {
    // Call the API (returns a Promise -> handled with await)
    const response = await fetch(`${API_BASE}/events`);

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const events = await response.json();

    // Show a friendly message when there are no upcoming events
    if (events.length === 0) {
      grid.innerHTML = '<p class="loading-text">There are no upcoming events at the moment. Please check back soon!</p>';
      return;
    }

    // Build the event cards (DOM manipulation)
    grid.innerHTML = events.map(event => createEventCard(event)).join('');
  } catch (error) {
    console.error('Failed to load events:', error);
    errorBox.textContent = 'Sorry, we could not load the events. Please make sure the API server is running and try again.';
    errorBox.classList.remove('hidden');
    grid.innerHTML = '';
  }
}

// Creates the HTML for a single event card.
// Each card links to the event details page via a URL query string.
function createEventCard(event) {
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
}
