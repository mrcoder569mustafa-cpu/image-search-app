const accessKey = "JoQKQiAgyccZ6hgX8Jhx9-iUAUNNx2fIc20NZmbI-0Q";

const formEl = document.querySelector("form");
const searchInputEl = document.getElementById("search-input");
const searchResultsEl = document.querySelector(".search-results");
const showMoreButtonEl = document.getElementById("show-more-button");
const categoriesEl = document.getElementById("categories"); // optional categories container

let inputData = "";
let page = 1;

// Fetch images from Unsplash
async function searchImages() {
  inputData = searchInputEl.value || inputData; // use last input if empty
  if (!inputData) return alert("Please enter a search term!");

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${inputData}&client_id=${accessKey}&per_page=12`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (page === 1) searchResultsEl.innerHTML = "";

    const results = data.results;

    results.forEach((result) => {
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("search-result");

      // Image element
      const image = document.createElement("img");
      image.src = result.urls.small;
      image.alt = result.alt_description || "Unsplash Image";

      // Link to Unsplash page
      const imageLink = document.createElement("a");
      imageLink.href = result.links.html;
      imageLink.target = "_blank";
      imageLink.textContent = result.alt_description || "View Image";

      // Download button
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "Download";
      downloadBtn.classList.add("download-btn");

      downloadBtn.addEventListener("click", async () => {
        try {
          const imageUrl = result.urls.full;
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = (result.alt_description || "image") + ".jpg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch (err) {
          console.error("Download failed", err);
        }
      });

      // Append elements
      imageWrapper.appendChild(image);
      imageWrapper.appendChild(imageLink);
      imageWrapper.appendChild(downloadBtn);
      searchResultsEl.appendChild(imageWrapper);
    });

    page++;
    showMoreButtonEl.style.display = "block";
  } catch (err) {
    console.error("Error fetching images:", err);
  }
}

// Event: Form submit
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  page = 1;
  searchImages();
});

// Event: Load More button
showMoreButtonEl.addEventListener("click", () => {
  searchImages();
});

// Infinite Scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 100
  ) {
    searchImages();
  }
});

// Categories buttons (optional, HTML required)
/*
<div id="categories">
  <button data-category="Nature">Nature</button>
  <button data-category="Technology">Technology</button>
  <button data-category="Animals">Animals</button>
</div>
*/
if (categoriesEl) {
  categoriesEl.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      inputData = e.target.dataset.category;
      searchInputEl.value = inputData;
      page = 1;
      searchImages();
    }
  });
}
