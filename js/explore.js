document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  const ratingFilter = document.getElementById("ratingFilter");
  const sortFilter = document.getElementById("sortFilter");
  const clearFilters = document.getElementById("clearFilters");
  const container = document.getElementById("exploreBooks");
  const count = document.getElementById("resultsCount");
  const empty = document.getElementById("emptyState");

  const genres = [...new Set(books.flatMap(book => book.genre))].sort();
  genreFilter.innerHTML = `<option value="all">All genres</option>` +
    genres.map(g => `<option value="${g}">${g}</option>`).join("");

  const params = new URLSearchParams(window.location.search);
  searchInput.value = params.get("q") || "";

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const genre = genreFilter.value;
    const minRating = Number(ratingFilter.value);
    const sort = sortFilter.value;

    let results = books.filter(book => {
      const searchable = [
        book.title, book.author,
        ...book.genre, ...book.tags, ...book.style
      ].join(" ").toLowerCase();

      return (!query || searchable.includes(query)) &&
             (genre === "all" || book.genre.includes(genre)) &&
             book.rating >= minRating;
    });

    if (sort === "price-low") results.sort((a,b) => lowestPrice(a) - lowestPrice(b));
    if (sort === "price-high") results.sort((a,b) => lowestPrice(b) - lowestPrice(a));
    if (sort === "rating") results.sort((a,b) => b.rating - a.rating);
    if (sort === "title") results.sort((a,b) => a.title.localeCompare(b.title));

    count.textContent = `${results.length} book${results.length === 1 ? "" : "s"} found`;
    container.innerHTML = results.map(book => bookCard(book)).join("");
    empty.classList.toggle("hidden", results.length !== 0);
  }

  [searchInput, genreFilter, ratingFilter, sortFilter].forEach(el => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  clearFilters.addEventListener("click", () => {
    searchInput.value = "";
    genreFilter.value = "all";
    ratingFilter.value = "0";
    sortFilter.value = "featured";
    render();
  });

  render();
});
