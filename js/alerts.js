document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("alertsList");
  const empty = document.getElementById("alertsEmpty");
  const trackedCount = document.getElementById("trackedCount");
  const reachedCount = document.getElementById("reachedCount");
  const savingsAmount = document.getElementById("savingsAmount");

  function render() {
    const alerts = getTrackedAlerts();

    trackedCount.textContent = alerts.length;
    const reached = alerts.filter(a => a.currentPrice <= a.targetPrice);
    reachedCount.textContent = reached.length;

    const savings = reached.reduce((sum, a) => {
      return sum + Math.max(0, a.targetPrice - a.currentPrice);
    }, 0);
    savingsAmount.textContent = `₹${formatNumber(savings)}`;

    empty.classList.toggle("hidden", alerts.length > 0);
    list.innerHTML = alerts.map(alert => {
      const book = getBook(alert.bookId);
      if (!book) return "";
      const reachedTarget = alert.currentPrice <= alert.targetPrice;

      return `
        <article class="alert-item">
          <div class="book-cover alert-cover">
            ${
              book.cover
                ? `<img src="${book.cover}" alt="${book.title} cover">`
                : `<span>${book.title}<br><small>COVER</small></span>`
            }
          </div>
          <div>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p style="margin-top:8px">Target: <strong>₹${formatNumber(alert.targetPrice)}</strong></p>
            <div class="alert-actions">
              <a href="book.html?id=${book.id}">View book →</a>
              <button data-remove="${book.id}">Remove</button>
            </div>
          </div>
          <div class="alert-price">
            <span class="price-label">Lowest current price</span>
            <strong>₹${formatNumber(alert.currentPrice)}</strong>
            ${reachedTarget ? `<div class="target-reached">✓ Target reached</div>` : `<p>₹${formatNumber(alert.currentPrice - alert.targetPrice)} above target</p>`}
          </div>
        </article>
      `;
    }).join("");

    list.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.remove);
        saveTrackedAlerts(getTrackedAlerts().filter(a => a.bookId !== id));
        render();
        showToast("Price alert removed.");
      });
    });
  }

  render();
});
