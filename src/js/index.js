let searchQuery = "";
let imagesData = [];
let currentPage = 1;

// Function to fetch data from the Unsplash API
async function fetchData(query, page) {
  try {
    const clientId = "g8_qoQKYdMbsTV5sFCGQDtDZrJZGDAvfUDjElBoNvdE";
    const perPage = 10;
    console.log("serach query in fetch data", query);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&query=${query}&client_id=${clientId}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}
// Function to fetch random images from the Unsplash API
async function fetchRandomImages() {
  try {
    const clientId = "g8_qoQKYdMbsTV5sFCGQDtDZrJZGDAvfUDjElBoNvdE";
    const perPage = 15; 
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=${perPage}&client_id=${clientId}`
    );
    const data = await response.json();
    console.log("Random images fetched successfully:", data); 
    return data; 
  } catch (error) {
    console.error("Error fetching random images:", error);
    return []; 
  }
}

// Update UI with random images on page load
window.addEventListener("load", async () => {
  try {
    const randomImagesData = await fetchRandomImages();
    imagesData = randomImagesData;
    updateSubtitle("Random Images"); 
    renderImages(); 
    attachImageHoverListeners(imagesData);
  } catch (error) {
    console.error("Error loading random images:", error);
  }
});
// Event listener for search button click
document.querySelector(".search-btn").addEventListener("click", async () => {
  const searchInput = document.querySelector(".search-input").value.trim();
  clearImages();
  if (searchInput !== "") {
    searchQuery = searchInput; // Update search query
    console.log("Search query:", searchQuery); // Log search query
    currentPage = 1; // Reset current page to 1 when performing a new search
    await updateImages().then(() => {
      checkIfImagesRendered();
    }); // Fetch and update images
  }
});

// Event listener for pressing Enter in search input
document
  .querySelector(".search-input")
  .addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      const searchInput = document.querySelector(".search-input").value.trim();
      if (searchInput !== "") {
        searchQuery = searchInput; // Update search query
        console.log("Search query:", searchQuery); // Log search query
        currentPage = 1; // Reset current page to 1 when performing a new search
        await updateImages().then(() => {
          checkIfImagesRendered();
        }); // Fetch and update images
      }
    }
  });

// Update the event listener for the "Show More" button
document.getElementById("load-more-btn").addEventListener("click", async () => {
  try {
    currentPage++;
    await updateImages().then(() => {
      checkIfImagesRendered();
    });
  } catch (error) {
    console.error("Error loading more images:", error);
  }
});
// Function to check if images are rendered and show the "Show More" button
function checkIfImagesRendered() {
  const imagesContainer = document.querySelector(".grid");
  const loadMoreButton = document.getElementById("load-more-btn");

  if (imagesContainer.children.length > 0) {
    loadMoreButton.style.display = "block"; // Show the button
  } else {
    loadMoreButton.style.display = "none"; // Hide the button
  }
}
// Update search query and fetch images based on category button click
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const category = button.dataset.query;
    searchQuery = category; // Update search query with category
    console.log("Search query:", searchQuery); // Log search query
    clearImages(); // Clear existing images

    // Set the value of the input field to the category name
    document.querySelector(".search-input").value = category;

    await updateImages().then(() => {
      checkIfImagesRendered();
    }); // Fetch and update images
  });
});

// Function to clear existing images
function clearImages() {
  const imagesContainer = document.querySelector(".grid");
  imagesContainer.innerHTML = "";
  imagesData = [];
}

// Function to update UI with images data
function renderImages() {
  const imagesContainer = document.querySelector(".grid");
  imagesContainer.innerHTML = "";

  imagesData.forEach((image, index) => {
    const imageElement = document.createElement("div");
    imageElement.classList.add("image");
    imageElement.dataset.index = index;
    imageElement.dataset.id = image.id;
    imageElement.innerHTML = `
      <img src="${image.urls.regular}" alt="${image.description}">
      `;
    imagesContainer.appendChild(imageElement);
  });

  // Attach click event listeners after rendering images
  attachImageClickListeners(imagesData);
}
// Function to update UI with subtitle text
function updateSubtitle(query) {
  const subtitle = document.querySelector(".subtitle");
  if (query === "My Favorites") {
    subtitle.textContent = query;
  } else {
    subtitle.textContent =
      query === "Random Images" ? "Random Images" : `Results for ${query}`;
  }
}
// Function to update UI with images data and attach click event listeners to images
async function updateImages() {
  try {
    // Fetch images data for the current page
    console.log(
      "Fetching images data for query:",
      searchQuery,
      "page:",
      currentPage
    );
    const newImagesData = await fetchData(searchQuery, currentPage);
    imagesData = [...imagesData, ...newImagesData];
    updateSubtitle(searchQuery);

    // Update UI with fetched data
    renderImages();
    attachImageHoverListeners(imagesData);
    attachImageClickListeners(imagesData);
  } catch (error) {
    console.error("Error updating images:", error);
  }
}

// Function to attach click event listeners to images
function attachImageClickListeners(imagesData) {
  const images = document.querySelectorAll(".image");
  images.forEach((image) => {
    image.addEventListener("click", () => {
      const imageIndex = parseInt(image.dataset.index);
      let selectedImage;
      if (imagesData) {
        selectedImage = imagesData[imageIndex];
      } else {
        // Get favorite images from local storage
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
        selectedImage = favorites[imageIndex];
      }
      openModal(selectedImage);
    });
  });
}
// Function to open the modal popup with artwork details
function openModal(selectedImage) {
  const modal = document.getElementById("myModal");
  const modalContent = document.getElementById("modal-content");
  const selectedImageJSON = JSON.stringify(selectedImage);

  // Construct the HTML content
  let htmlContent = `
    <span class="close" id="close-modal">&times;</span>
    <div class="image-container">
      <img src="${selectedImage.urls.thumb}" alt="${
    selectedImage.description
  }">
    </div>
    <div class="details-container">
      <div id="artist-info">
        <a href="#" onclick="openPortfolio('${
          selectedImage.user.portfolio_url
        }')">
          <img id="profile-pic" src="${
            selectedImage.user.profile_image.large
          }" alt="Profile Picture">
        </a>
        <span>${selectedImage.user.name}</span>
      </div>
      <p>Description: ${selectedImage.description}</p>
      <p>Likes: ${selectedImage.likes}</p>
      <p>Created At: ${new Date(selectedImage.created_at).toLocaleDateString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )}</p>
      <div id="social-links">
        <button id="instagram-btn" onclick="openInstagram('${
          selectedImage.user.instagram_username
        }')">Instagram</button>
        <button id="portfolio-btn" onclick="openPortfolio('${
          selectedImage.user.portfolio_url
        }')">Portfolio</button>
        <button id="twitter-btn" onclick="openTwitter('${
          selectedImage.user.twitter_username
        }')">Twitter</button>
      `;

  // Check if the image is from favorites and exclude "Add Favorite" button if it is
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.some((image) => image.id === selectedImage.id)) {
    htmlContent += `<button class="favorite-btn-modal">Add Favorite</button>`;
  }

  htmlContent += `</div></div>`;

  // Set the HTML content
  modalContent.innerHTML = htmlContent;

  // Show the modal
  modal.style.display = "block";

  // Attach event listener to the close button
  const closeModalButton = document.getElementById("close-modal");
  closeModalButton.addEventListener("click", () => {
    closeModal();
  });

  // Attach event listener to the modal overlay to close modal when clicking outside
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Attach event listener to the "Add Favorite" button
  const favoriteButton = modalContent.querySelector(".favorite-btn-modal");
  if (favoriteButton) {
    favoriteButton.addEventListener("click", () => {
      toggleFavorite(selectedImage);
      // Change button text to "Added" after clicking
      favoriteButton.textContent = "Added";
      // favoriteButton.remove();
    });
  }
}
// Event listener for "My Fav" button click
document.querySelector(".my-fav-btn").addEventListener("click", () => {
  clearImages(); // Clear existing images
  document.querySelector('.search-input').value = '';

  const favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Get favorite images from local storage
  renderFavoriteImages(favorites); // Render favorite images
});

function openTwitter(username) {
  window.open(`https://twitter.com/${username}`, "_blank");
}

function openInstagram(username) {
  window.open(`https://www.instagram.com/${username}`, "_blank");
}

function openPortfolio(portfolioUrl) {
  window.open(portfolioUrl, "_blank");
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function toggleFavorite(artwork) {
  // Check if artwork is already favorited
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const index = favorites.findIndex((favorite) => favorite.id === artwork.id);

  if (index !== -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(artwork);
  }

  // Update local storage with updated favorites
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateUI();
}

function updateUI() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Loop through all artworks and update their UI based on favorite status
  document.querySelectorAll(".favorite-btn-modal").forEach((btn) => {
    const artworkId = btn.closest(".modal-content").dataset.id;
   
  });
}
// Event listener for "My Fav" button click
document.querySelector(".my-fav-btn").addEventListener("click", () => {
  clearImages(); 
  const favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Get favorite images from local storage
  console.log("clicked", favorites);
  updateSubtitle("My Favorites"); 

  renderFavoriteImages(favorites); 
});

// Function to render favorite images
function renderFavoriteImages(favoriteIds) {
  const imagesContainer = document.querySelector(".grid");
  const loadMoreButton = document.getElementById("load-more-btn");

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
  // Attach click event listeners after rendering images
  attachImageClickListeners();
  loadMoreButton.style.display = "none";
}


// Attach hover event listeners to images
function attachImageHoverListeners(imagesData) {
  const images = document.querySelectorAll(".image");
  images.forEach((image) => {
    image.addEventListener("mouseenter", () => {
      const imageIndex = parseInt(image.dataset.index);
      const selectedImage = imagesData[imageIndex];
      updateImageHoverUI(image, selectedImage);
    });
    image.addEventListener("mouseleave", () => {
      clearImageHoverUI(image);
    });
  });
}

// Update UI with profile pic, name, and number of likes when hovering over an image
function updateImageHoverUI(imageElement, imageData) {
  const profilePic = document.createElement("img");
  profilePic.src = imageData.user.profile_image.medium;
  profilePic.alt = "Profile Picture";
  profilePic.id = "profile-pic";

  const artistName = document.createElement("span");
  artistName.textContent = imageData.user.name;
  artistName.id = "artist-name";

  const profileInfo = document.createElement("div");
  profileInfo.id = "profile-info";
  profileInfo.appendChild(profilePic);
  profileInfo.appendChild(artistName);

  imageElement.appendChild(profileInfo);

  imageElement.dataset.likes = imageData.likes;
}

// Clear profile pic, name, and number of likes when mouse leaves the image
function clearImageHoverUI(imageElement) {
  const profileInfo = imageElement.querySelector("#profile-info");
  if (profileInfo) {
    profileInfo.remove();
  }
}