import { clearImages, renderFavoriteImages } from './favorites.js';
import { updateSubtitle } from './ui.js';
import { updateImages } from './images.js';

document.querySelector(".my-fav-btn").addEventListener("click", () => {
  clearImages();
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  updateSubtitle("My Favorites");
  renderFavoriteImages(favorites);
});

document.querySelector(".search-btn").addEventListener("click", async () => {
  const searchInput = document.querySelector(".search-input").value.trim();
  clearImages();
  if (searchInput !== "") {
    searchQuery = searchInput;
    currentPage = 1;
    await updateImages();
  }
});

document.querySelector(".search-input").addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const searchInput = document.querySelector(".search-input").value.trim();
    if (searchInput !== "") {
      searchQuery = searchInput;
      currentPage = 1;
      await updateImages();
    }
  }
});

document.getElementById("load-more-btn").addEventListener("click", async () => {
  try {
    currentPage++;
    await updateImages();
  } catch (error) {
    console.error("Error loading more images:", error);
  }
});

document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const category = button.dataset.query;
    searchQuery = category;
    clearImages();
    document.querySelector(".search-input").value = category;
    await updateImages();
  });
});
