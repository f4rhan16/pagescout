document.addEventListener("DOMContentLoaded", () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const book = getBook(id);
  const container = document.getElementById("bookDetails");

  if (!book) {
    container.innerHTML = `<div class="empty-state"><h3>Book not found</h3><p>Return to Explore and choose a book.</p></div>`;
    return;
  }

  document.title = `${book.title} — PageScout`;
  const prices = Object.entries(book.prices);
  const lowest = lowestPrice(book);
  const alerts = getTrackedAlerts();
  const tracked = alerts.find(a => a.bookId === book.id);

  container.innerHTML = `
    <section class="book-detail-hero">
      <div class="cover-placeholder detail-cover">
      ${book.cover
        ? `<img src="${book.cover}" alt="${book.title} cover">`
        : `BOOK<br>COVER<br><small>${book.title}</small>`
      }
      </div>
      <div class="detail-copy">
        <span class="eyebrow">${book.genre.join(" • ").toUpperCase()}</span>
        <h1>${book.title}</h1>
        <div class="author">by ${book.author}</div>
        <div class="rating-line">
          <span class="stars">★★★★★</span>
          <strong>${book.rating}</strong>
          <span class="rating-count">${formatNumber(book.reviews)} reader reviews</span>
        </div>
        <p class="detail-description">${book.description}</p>
        <div class="tag-list">${book.tags.map(tag => `<span class="tag">#${tag}</span>`).join("")}</div>
        <div class="detail-meta"><strong>${book.pages}</strong> pages</div>
        <div class="detail-actions">
          <button class="btn btn-primary" id="trackButton">${tracked ? "✓ Price tracked" : "⌁ Track Price"}</button>
          <a class="btn btn-secondary" href="compare.html?book=${book.id}">⇄ Compare books</a>
        </div>
      </div>
    </section>

    <section class="data-section">
      <h2>Price comparison</h2>
      <table class="price-table">
        <thead><tr><th>Store</th><th>Current price</th><th>Availability</th><th></th></tr></thead>
        <tbody>
          ${prices.map(([store, price]) => `
            <tr class="${price === lowest ? "best-price" : ""}">
              <td><strong>${store}</strong>${price === lowest ? " · Best price" : ""}</td>
              <td><strong>₹${formatNumber(price)}</strong></td>
              <td class="availability">✓ In Stock</td>
              <td>
                <a
                  class="small-link"
                  href="${book.links[store]}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View deal →
                </a>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>

    <section class="data-section">
      <h2>Price history</h2>
      <div class="price-chart">
        ${book.priceHistory.map((price, i) => {
          const max = Math.max(...book.priceHistory);
          const min = Math.min(...book.priceHistory);
          const height = 20 + ((price - min) / Math.max(1, max - min)) * 65;
          const month = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"][i] || `M${i+1}`;
          return `<div class="chart-bar"><span>₹${price}</span><div class="chart-fill" style="height:${height}%"></div><span>${month}</span></div>`;
        }).join("")}
      </div>
    </section>

    <section class="data-section">
      <h2>Review & rating analysis</h2>
      <div class="review-grid">
        <div class="review-score">
          <div class="big-rating">${book.rating}</div>
          <div class="stars">★★★★★</div>
          <p class="author">${formatNumber(book.reviews)} reviews</p>
          <br>
          <strong>Overall sentiment: Very Positive</strong>
        </div>
        <div class="review-bars">
          ${[5,4,3,2,1].map(star => `
            <div class="review-row">
              <span>${star} stars</span>
              <div class="bar-track"><span style="width:${book.reviewDistribution[star]}%"></span></div>
              <span>${book.reviewDistribution[star]}%</span>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;

  document.getElementById("trackButton").addEventListener("click", () => {
    let currentAlerts = getTrackedAlerts();
    const existing = currentAlerts.find(a => a.bookId === book.id);

    if (existing) {
      currentAlerts = currentAlerts.filter(a => a.bookId !== book.id);
      saveTrackedAlerts(currentAlerts);
      document.getElementById("trackButton").textContent = "⌁ Track Price";
      showToast("Removed from price alerts.");
      return;
    }

    const target = Math.max(1, lowest - 50);
    currentAlerts.push({ bookId: book.id, targetPrice: target, currentPrice: lowest });
    saveTrackedAlerts(currentAlerts);
    document.getElementById("trackButton").textContent = "✓ Price tracked";
    showToast(`Tracking ${book.title}. Target price: ₹${target}`);
  });
});
