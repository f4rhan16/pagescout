function formatNumber(num) {
  return new Intl.NumberFormat("en-IN").format(num);
}

function lowestPrice(book) {
  return Math.min(...Object.values(book.prices));
}

function getTrackedAlerts() {
  return JSON.parse(localStorage.getItem("pagescoutAlerts") || "[]");
}

function saveTrackedAlerts(alerts) {
  localStorage.setItem("pagescoutAlerts", JSON.stringify(alerts));
}

function getBook(id) {
  return books.find(book => book.id === Number(id));
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 2800);
}

function bookCard(book, showCompare = true) {
  const lowest = lowestPrice(book);

  return `
    <article class="book-card">
      <div class="book-cover">
        ${
          book.cover
            ? `<img src="${book.cover}" alt="${book.title} cover">`
            : `<span>BOOK COVER</span>`
        }
      </div>

      <div class="book-info">
        <h3>${book.title}</h3>
        <div class="author">${book.author}</div>

        <div class="rating-line">
          <span class="stars">★★★★★</span>
          <strong>${book.rating}</strong>
          <span class="rating-count">(${formatNumber(book.reviews)})</span>
        </div>

        <div class="price-line">
          <div>
            <span class="price-label">From</span>
            <strong>₹${formatNumber(lowest)}</strong>
          </div>
        </div>

        <div class="card-actions">
          <a class="btn btn-primary" href="book.html?id=${book.id}">
            View details
          </a>

          ${
            showCompare
              ? `<a class="btn btn-secondary" title="Compare this book" href="compare.html?book=${book.id}">⇄</a>`
              : ""
          }
        </div>
      </div>
    </article>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const trending = document.getElementById("trendingBooks");
  if (trending) {
    const popular = [...books].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4);
    trending.innerHTML = popular.map(book => bookCard(book)).join("");
  }

  const homeSearch = document.getElementById("homeSearch");
  if (homeSearch) {
    homeSearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("homeSearchInput").value.trim();
      window.location.href = `explore.html${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    });
  }
});
