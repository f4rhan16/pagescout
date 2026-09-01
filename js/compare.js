document.addEventListener("DOMContentLoaded", () => {
  const one = document.getElementById("compareOne");
  const two = document.getElementById("compareTwo");
  const result = document.getElementById("compareResult");

  const options = books.map(book => `<option value="${book.id}">${book.title}</option>`).join("");
  one.innerHTML = options;
  two.innerHTML = options;

  const params = new URLSearchParams(window.location.search);
  const selected = Number(params.get("book")) || 1;
  one.value = String(selected);
  two.value = String(selected === 1 ? 2 : 1);

  function render() {
    const a = getBook(one.value);
    const b = getBook(two.value);

    const aPrice = lowestPrice(a);
    const bPrice = lowestPrice(b);

    const metric = (label, av, bv, winner) => `
      <div class="compare-metric">
        <div>${label}</div>
        <div class="${winner === "a" ? "compare-winner" : ""}">${av}</div>
        <div class="${winner === "b" ? "compare-winner" : ""}">${bv}</div>
      </div>
    `;

    const priceWinner = aPrice < bPrice ? "a" : bPrice < aPrice ? "b" : "tie";
    const ratingWinner = a.rating > b.rating ? "a" : b.rating > a.rating ? "b" : "tie";
    const reviewWinner = a.reviews > b.reviews ? "a" : b.reviews > a.reviews ? "b" : "tie";

    let verdict = "Both books are currently tied on the selected comparison points.";
    if (priceWinner === "a") verdict = `${a.title} is currently ₹${bPrice - aPrice} cheaper at its lowest listed price.`;
    if (priceWinner === "b") verdict = `${b.title} is currently ₹${aPrice - bPrice} cheaper at its lowest listed price.`;

    result.innerHTML = `
      <div class="compare-result">
        <div class="compare-books">
          <div class="compare-book">
            <div class="book-cover">
              ${a.cover
                ? `<img src="${a.cover}" alt="${a.title} cover">`
                : `<span>BOOK COVER</span>`
              }
            </div>
          <h2>${a.title}</h2>
          <p class="author">${a.author}</p>
          </div>
          <div class="compare-book">
            <div class="book-cover">
            ${b.cover
            ? `<img src="${b.cover}" alt="${b.title} cover">`
            : `<span>BOOK COVER</span>`
            }
            </div>
          <h2>${b.title}</h2>
          <p class="author">${b.author}</p>
          </div>
        </div>

        ${metric("Rating", `${a.rating} ★`, `${b.rating} ★`, ratingWinner)}
        ${metric("Reviews", formatNumber(a.reviews), formatNumber(b.reviews), reviewWinner)}
        ${metric("Lowest price", `₹${formatNumber(aPrice)}`, `₹${formatNumber(bPrice)}`, priceWinner)}
        ${metric("Pages", formatNumber(a.pages), formatNumber(b.pages), "tie")}
        ${metric("Genres", a.genre.join(", "), b.genre.join(", "), "tie")}

        <div style="padding:0 22px 22px;">
          <div class="compare-verdict"><strong>Quick verdict:</strong> ${verdict}</div>
        </div>
      </div>
    `;
  }

  one.addEventListener("change", render);
  two.addEventListener("change", render);
  render();
});
