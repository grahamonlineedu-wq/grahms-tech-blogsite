document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
  bindCategoryControls();
});

let allPosts = [];

const fallbackPosts = [
  {
    id: 1,
    title: 'Why resilient architecture starts before the first line of code',
    category: 'Information Tech',
    excerpt: 'Design decisions around observability, schema stability, and deployment safety often matter more than the framework choice itself.',
    content: 'A resilient system is built with early consideration for failure modes, staging checks, and recovery strategy.',
    created_at: '2026-09-01T09:00:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    title: 'The quiet power of smart wearables in everyday productivity',
    category: 'Gadgets',
    excerpt: 'Wearables are no longer novelty devices; they are becoming decision-support systems for health, focus, and movement.',
    content: 'The next wave of smart devices focuses less on hype and more on practical context-aware assistance.',
    created_at: '2026-08-20T12:00:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    title: 'How EV powertrains are changing the design language of mobility',
    category: 'AutoTech',
    excerpt: 'The shift to efficient, software-integrated electric platforms is redefining both performance and consumer expectations.',
    content: 'Vehicle design is increasingly determined by battery geometry, thermal path optimization, and user-facing digital UX.',
    created_at: '2026-08-10T13:30:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    title: 'AI hardware is moving from edge gimmicks to real production tooling',
    category: 'AI & Hardware',
    excerpt: 'The hardware story is quietly shifting toward faster inference, lower latency, and stronger on-device privacy models.',
    content: 'Hardware acceleration, efficient model deployment, and local intelligence are becoming normal engineering concerns.',
    created_at: '2026-07-22T14:15:00.000Z',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
  }
];

function bindCategoryControls() {
  document.querySelectorAll('.pill').forEach((pill) => {
    pill.addEventListener('click', () => filterCategory(pill.dataset.category || pill.textContent.trim()));
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      filterCategory(link.dataset.category || link.textContent.trim());
    });
  });
}

async function fetchPosts() {
  const postsGrid = document.getElementById('posts-grid');

  try {
    const response = await fetch('/api/posts');
    if (!response.ok) throw new Error('Network response failed');

    const data = await response.json();
    allPosts = Array.isArray(data) && data.length ? data : fallbackPosts;
    renderPosts(allPosts);
  } catch (error) {
    console.error('Error fetching articles:', error);
    allPosts = fallbackPosts;
    renderPosts(allPosts);

    if (postsGrid) {
      postsGrid.insertAdjacentHTML(
        'beforeend',
        '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 1rem 0;">Using preview content while the backend connects.</div>'
      );
    }
  }
}

function renderPosts(posts) {
  const postsGrid = document.getElementById('posts-grid');
  if (!postsGrid) return;

  postsGrid.innerHTML = '';

  if (!posts || posts.length === 0) {
    postsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">
        <p>No articles found for this category.</p>
      </div>
    `;
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement('article');
    card.className = 'post-card';

    const dateFormatted = post.created_at
      ? new Date(post.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : 'Recently';

    const coverImg =
      post.image_url ||
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80';

    card.innerHTML = `
      <div style="width:100%; height:160px; overflow:hidden; border-radius:8px; margin-bottom:0.85rem; background: rgba(0,0,0,0.25);">
        <img src="${coverImg}" alt="${post.title}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <span class="cat-tag">${post.category || 'General'}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt || (post.content ? post.content.substring(0, 90) + '...' : '')}</p>
      <div style="margin-top:0.75rem; font-size:0.8rem; color:var(--text-muted); font-family: var(--font-code);">
        Published ${dateFormatted}
      </div>
    `;

    postsGrid.appendChild(card);
  });
}

function filterCategory(category) {
  const categoryName = category || 'All';

  const pills = document.querySelectorAll('.pill');
  pills.forEach((pill) => {
    const isActive = (pill.dataset.category || pill.textContent.trim()) === categoryName;
    pill.classList.toggle('active', isActive);
  });

  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach((link) => {
    const isActive = (link.dataset.category || link.textContent.trim()) === categoryName;
    link.classList.toggle('active', isActive);
  });

  if (categoryName === 'All') {
    renderPosts(allPosts);
    return;
  }

  const filtered = allPosts.filter(
    (post) =>
      post.category &&
      post.category.toLowerCase().includes(categoryName.toLowerCase())
  );
  renderPosts(filtered);
}
