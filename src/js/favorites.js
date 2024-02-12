export function toggleFavorite(artwork) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.findIndex((favorite) => favorite.id === artwork.id);
  
    if (index !== -1) {
      favorites.splice(index, 1);
      console.log(`Removed artwork with ID ${artwork.id} from favorites.`);
    } else {
      favorites.push(artwork);
      console.log(`Added artwork with ID ${artwork.id} to favorites.`);
    }
  
    localStorage.setItem("favorites", JSON.stringify(favorites));
    updateUI();
  }
  
  export function updateUI() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
    document.querySelectorAll(".favorite-btn-modal").forEach((btn) => {
      const artworkId = btn.closest(".modal-content").dataset.id;
      const isFavorite = favorites.some((favorite) => favorite.id === artworkId);
    });
  }
  
  export function renderFavoriteImages(favoriteIds) {
    const imagesContainer = document.querySelector(".grid");
  
    favoriteIds.forEach((image, index) => {
      const imageElement = document.createElement("div");
  
      imageElement.classList.add("image");
      imageElement.dataset.index = index;
      imageElement.dataset.id = image.id;
      imageElement.innerHTML = `
        <img src="${image.urls.regular}" alt="${image.description}">
      `;
      imagesContainer.appendChild(imageElement);
    });
  
    const loadMoreButton = document.getElementById("load-more-btn");
    loadMoreButton.style.display = "none";
  }
  // Function to clear existing images
  export function clearImages() {
    const imagesContainer = document.querySelector(".grid");
    imagesContainer.innerHTML = ""; // Clear existing images
    imagesData = []; // Clear existing images data
  }