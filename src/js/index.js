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

// Event listener for search button click
document.querySelector(".search-btn").addEventListener("click", async () => {
  const searchInput = document.querySelector(".search-input").value.trim();
  clearImages();
  if (searchInput !== "") {
    searchQuery = searchInput;
    currentPage = 1;
    await updateImages();
  }
});

// Event listener for pressing Enter in search input
document
  .querySelector(".search-input")
  .addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
      const searchInput = document.querySelector(".search-input").value.trim();
      if (searchInput !== "") {
        searchQuery = searchInput;
        console.log("Search query:", searchQuery);
        currentPage = 1;
        await updateImages();
      }
    }
  });

// Update the event listener for the "Show More" button
document.getElementById("load-more-btn").addEventListener("click", async () => {
  try {
    currentPage++;
    await updateImages();
  } catch (error) {
    console.error("Error loading more images:", error);
  }
});
// Update search query and fetch images based on category button click
document.querySelectorAll(".category-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const category = button.dataset.query;
    searchQuery = category;
    clearImages(); 

    document.querySelector(".search-input").value = category;

    await updateImages();
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
  attachImageClickListeners();
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

    // Update UI with fetched data
    renderImages();
    attachImageClickListeners();
  } catch (error) {
    console.error("Error updating images:", error);
  }
}

// Function to attach click event listeners to images
function attachImageClickListeners() {
  const images = document.querySelectorAll(".image");
  images.forEach((image) => {
    image.addEventListener("click", () => {
      const imageIndex = parseInt(image.dataset.index);
      let selectedImage;
      selectedImage = imagesData[imageIndex];

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
      <img src="${selectedImage.urls.regular}" alt="${
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
        <button class="favorite-btn-modal">Add Favorite</button>
      `;
      
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
      favoriteButton.remove();
    });
  }
}

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
    if (favorites.includes(artworkId)) {
      btn.textContent = "Remove Favorite";
    } else {
      btn.textContent = "Add Favorite";
    }
  });
}
