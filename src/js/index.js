// Simulated state variables
let searchQuery = ""; // Default search query
let imagesData = []; // Array to store fetched images data
let currentPage = 1; // Current page number for pagination

// Function to fetch data from the Unsplash API
async function fetchData(query, page) {
  try {
    const clientId = "g8_qoQKYdMbsTV5sFCGQDtDZrJZGDAvfUDjElBoNvdE"; // Replace 'your_access_key_here' with your actual Unsplash access key
    const perPage = 10; // Number of items per page
    console.log("serach query in fetch data", query);
    const response = await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&query=${query}&client_id=${clientId}`
    );
    const data = await response.json();
    console.log("Data fetched successfully:", data); // Log the fetched data
    return data.results; // Return the results array from the API response
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array on error
  }
}

// Event listener for search button click
document.querySelector(".search-btn").addEventListener("click", async () => {
  const searchInput = document.querySelector(".search-input").value.trim();
  clearImages();
  if (searchInput !== "") {
    searchQuery = searchInput; // Update search query
    console.log("Search query:", searchQuery); // Log search query
    currentPage = 1; // Reset current page to 1 when performing a new search
    await updateImages(); // Fetch and update images
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
        await updateImages(); // Fetch and update images
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
    searchQuery = category; // Update search query with category
    console.log("Search query:", searchQuery); // Log search query
    clearImages(); // Clear existing images

    // Set the value of the input field to the category name
    document.querySelector(".search-input").value = category;

    await updateImages(); // Fetch and update images
  });
});

// Function to clear existing images
function clearImages() {
  const imagesContainer = document.querySelector(".grid");
  imagesContainer.innerHTML = ""; // Clear existing images
  imagesData = []; // Clear existing images data
}

// Function to update UI with images data
function renderImages() {
  const imagesContainer = document.querySelector('.grid');
  imagesContainer.innerHTML = ''; // Clear previous images

  imagesData.forEach((image, index) => { // Include index parameter
      const imageElement = document.createElement('div');
      imageElement.classList.add('image');
      imageElement.dataset.index = index; // Set data-index attribute
      imageElement.dataset.id = image.id; // Set data-id attribute for identifying artworks
      imageElement.innerHTML = `
      <img src="${image.urls.regular}" alt="${image.description}">
      `;
      imagesContainer.appendChild(imageElement);

      // Log the HTML content of the image element
     // console.log('Image HTML:', imageElement.innerHTML);
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
    ); // Log fetching images data
    const newImagesData = await fetchData(searchQuery, currentPage);
    // Append new images to the existing ones
    imagesData = [...imagesData, ...newImagesData];
    //  clearImages(); // Clear existing images

    // Update UI with fetched data
    renderImages();
    attachImageClickListeners();

  } catch (error) {
    console.error("Error updating images:", error);
  }
}

// Initial load - Fetch and render images
//updateImages();

// Function to attach click event listeners to images
function attachImageClickListeners() {
  const images = document.querySelectorAll('.image');
  images.forEach(image => {
      image.addEventListener('click', () => {
          const imageIndex = parseInt(image.dataset.index);
          let selectedImage;
              selectedImage = imagesData[imageIndex];

          openModal(selectedImage);
      });
  });
}
// Function to open the modal popup with artwork details
function openModal(selectedImage) {
  const modal = document.getElementById('myModal');
  const modalContent = document.getElementById('modal-content');
  const selectedImageJSON = JSON.stringify(selectedImage);
console.log(selectedImage.likes);
  // Construct the HTML content
  const htmlContent = `
    <span class="close" id="close-modal">&times;</span>
    <div class="image-container">
      <img src="${selectedImage.urls.regular}" alt="${selectedImage.description}">
    </div>
    <div class="details-container">
      <div id="artist-info">
        <a href="#" onclick="openPortfolio('${selectedImage.user.portfolio_url}')">
          <img id="profile-pic" src="${selectedImage.user.profile_image.medium}" alt="Profile Picture">
        </a>
        <span>${selectedImage.user.name}</span>
      </div>
      <p>Description: ${selectedImage.description}</p>
      <p>Likes: ${selectedImage.likes}</p>
      <p>Created At: ${new Date(selectedImage.created_at).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}</p>
      <div id="social-links">
        <button id="instagram-btn" onclick="openInstagram('${selectedImage.user.instagram_username}')">Instagram</button>
        <button id="portfolio-btn" onclick="openPortfolio('${selectedImage.user.portfolio_url}')">Portfolio</button>
        <button id="twitter-btn" onclick="openTwitter('${selectedImage.user.twitter_username}')">Twitter</button>
      </div>
    </div>
  `;

  modalContent.innerHTML = htmlContent;

  // Show the modal
  modal.style.display = 'block';

  // Attach event listener to the close button
  const closeModalButton = document.getElementById('close-modal');
  closeModalButton.addEventListener('click', () => {
    closeModal();
  });
}


// Function to open Twitter profile
function openTwitter(username) {
  window.open(`https://twitter.com/${username}`, '_blank');
}


// Function to open Instagram profile
function openInstagram(username) {
  window.open(`https://www.instagram.com/${username}`, '_blank');
}

// Function to open the portfolio link
function openPortfolio(portfolioUrl) {
  window.open(portfolioUrl, '_blank');
}

// Function to close the modal popup
function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}



