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
    postsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem 0;">
        <p>Unable to load stories. Ensure server is running.</p>
      </div>
    `;
  }
}

function renderPosts(posts) {
  const postsGrid = document.getElementById("posts-grid");
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

    card.innerHTML = `
      <span class="cat-tag">${post.category || "General"}</span>
      <h3>${post.title}</h3>
      <p>${post.excerpt || (post.content ? post.content.substring(0, 100) + "..." : "")}</p>
      <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-secondary);">
        Published ${dateFormatted}
      </div>
    `;

    postsGrid.appendChild(card);
  });
}

function filterCategory(category) {
  // 1. Synchronize Pill UI active states
  const pills = document.querySelectorAll(".filter-pills .pill");
  pills.forEach((pill) => {
    if (pill.textContent.trim().toLowerCase() === category.toLowerCase()) {
      pill.classList.add("active");
    } else {
      pill.classList.remove("active");
    }
  });

  // 2. Synchronize Header Links active states
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

  // 3. Filter and render database posts
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

