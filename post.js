document.addEventListener("DOMContentLoaded", () => {
  fetchPosts();
});

let allPosts = [];

async function fetchPosts() {
  const postsGrid = document.getElementById("posts-grid");

  try {
    const response = await fetch("/api/posts");
    if (!response.ok) throw new Error("Network response failed");

    allPosts = await response.json();
    renderPosts(allPosts);
  } catch (error) {
    console.error("Error fetching articles:", error);
    if (postsGrid) {
      postsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">
          <p>Unable to load stories. Ensure server is running.</p>
        </div>
      `;
    }
  }
}

function renderPosts(posts) {
  const postsGrid = document.getElementById("posts-grid");
  if (!postsGrid) return;

  postsGrid.innerHTML = "";

  if (posts.length === 0) {
    postsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">
        <p>No articles found for this category.</p>
      </div>
    `;
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "post-card";

    const dateFormatted = post.created_at
      ? new Date(post.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recently";

    const coverImg =
      post.image_url ||
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80";

    card.innerHTML = `
      <div style="width:100%; height:160px; overflow:hidden; border-radius:8px; margin-bottom:0.85rem;">
        <img src="${coverImg}" alt="${post.title}" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <span class="cat-tag">${post.category || "General"}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt || (post.content ? post.content.substring(0, 90) + "..." : "")}</p>
      <div style="margin-top:0.75rem; font-size:0.8rem; color:var(--text-secondary);">
        Published ${dateFormatted}
      </div>
    `;

    postsGrid.appendChild(card);
  });
}

function filterCategory(category) {
  const pills = document.querySelectorAll(".filter-pills .pill");
  pills.forEach((pill) => {
    if (pill.textContent.trim().toLowerCase() === category.toLowerCase()) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    const linkText = link.textContent.trim().toLowerCase();
    if (
      linkText === category.toLowerCase() ||
      (category === "All" && linkText === "all news")
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (category === "All") {
    renderPosts(allPosts);
  } else {
    const filtered = allPosts.filter(
      (post) =>
        post.category &&
        post.category.toLowerCase().includes(category.toLowerCase())
    );
    renderPosts(filtered);
  }
}
