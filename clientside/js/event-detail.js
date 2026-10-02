// ============================================================
// event-detail.js
// Event details page logic:
// 1. Reads the event_id from the URL query string
//    (passed from the Home / Search pages).
// 2. Fetches the full event details from GET /api/events/:id.
// 3. Renders all event information including the fundraising
//    goal vs progress bar.
// 4. The Register button shows an "under construction" dialog.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  loadEventDetails();
  document.getElementById('register-btn').addEventListener('click', handleRegister);
});

async function loadEventDetails() {
  const errorBox = document.getElementById('detail-error');

  // Get the event id from the query string, e.g. event-detail.html?event_id=3
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get('event_id');

  if (!eventId || isNaN(eventId)) {
    showLoadError('No event selected. Please choose an event from the Home or Search page.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/events/${eventId}`);

    if (response.status === 404) {
      showLoadError('This event does not exist. Please choose an event from the Home or Search page.');
      return;
    }
    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const event = await response.json();
    renderEvent(event);
  } catch (error) {
    console.error('Failed to load event details:', error);
    showLoadError('Sorry, we could not load this event. Please make sure the API server is running and try again.');
  }
}

// ------------------------------------------------------------
// Render the event data into the page (DOM manipulation)
// ------------------------------------------------------------
function renderEvent(event) {
  const date = new Date(event.event_date + 'T00:00:00');
  const dateStr = date.toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const timeStr = event.event_time
    ? event.event_time.slice(0, 5)
    : 'TBA';

  document.getElementById('event-category').textContent = event.category_name;
  document.getElementById('event-name').textContent = event.event_name;
  document.getElementById('event-description').textContent = event.event_description;
  document.getElementById('event-purpose').textContent = event.purpose;
  document.getElementById('event-date').textContent = dateStr;
  document.getElementById('event-time').textContent = timeStr;
  document.getElementById('event-venue').textContent = event.location_venue;
  document.getElementById('event-city').textContent = event.location_city;

  // Ticket price: show "Free" when the price is 0
  document.getElementById('event-ticket').textContent =
    Number(event.ticket_price) === 0
      ? 'Free'
      : `$${Number(event.ticket_price).toFixed(2)}`;

  // Organisation information
  document.getElementById('org-name').textContent = event.org_name;
  document.getElementById('org-description').textContent = event.org_description;
  document.getElementById('org-contact').textContent =
    `${event.contact_email} | ${event.contact_phone} | ${event.website}`;

  // Goal vs Progress
  const goal = Number(event.goal_amount);
  const progress = Number(event.progress_amount);
  const percent = goal > 0 ? Math.min(Math.round((progress / goal) * 100), 100) : 0;

  document.getElementById('progress-amount').textContent = `$${progress.toLocaleString('en-AU')} raised`;
  document.getElementById('goal-amount').textContent = `Goal: $${goal.toLocaleString('en-AU')}`;
  document.getElementById('progress-percent').textContent = `${percent}% of the goal reached`;
  document.getElementById('progress-fill').style.width = `${percent}%`;

  // Reveal the detail section
  document.getElementById('event-detail').classList.remove('hidden');
}

// ------------------------------------------------------------
// Register button: registration is not part of this assessment
// ------------------------------------------------------------
function handleRegister() {
  alert('This feature is currently under construction.');
}

function showLoadError(message) {
  const errorBox = document.getElementById('detail-error');
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  document.getElementById('event-detail').classList.add('hidden');
}
