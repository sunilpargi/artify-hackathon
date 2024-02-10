// Simulated state variables
let searchQuery = ''; // Default search query
let imagesData = []; // Array to store fetched images data
let currentPage = 1; // Current page number for pagination

// Function to fetch data from the Unsplash API
async function fetchData(query, page) {
  try {
    const clientId = 'g8_qoQKYdMbsTV5sFCGQDtDZrJZGDAvfUDjElBoNvdE'; // Replace 'your_access_key_here' with your actual Unsplash access key
    const perPage = 10; // Number of items per page
    console.log("serach query in fetch data", query);
    const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&per_page=${perPage}&query=${query}&client_id=${clientId}`);
    const data = await response.json();
    console.log('Data fetched successfully:', data); // Log the fetched data
    return data.results; // Return the results array from the API response
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array on error
  }
}

// Event listener for search button click
document.querySelector('.search-btn').addEventListener('click', async () => {
  const searchInput = document.querySelector('.search-input').value.trim();
  if (searchInput !== '') {
    searchQuery = searchInput; // Update search query
    console.log('Search query:', searchQuery); // Log search query
    currentPage = 1; // Reset current page to 1 when performing a new search
    await updateImages(); // Fetch and update images
  }
});

// Event listener for pressing Enter in search input
document.querySelector('.search-input').addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    const searchInput = document.querySelector('.search-input').value.trim();
    if (searchInput !== '') {
      searchQuery = searchInput; // Update search query
      console.log('Search query:', searchQuery); // Log search query
      currentPage = 1; // Reset current page to 1 when performing a new search
      await updateImages(); // Fetch and update images
    }
  }
});

// Update the event listener for the "Show More" button
document.getElementById('load-more-btn').addEventListener('click', async () => {
    try {
      currentPage++;
      await updateImages();
    } catch (error) {
      console.error('Error loading more images:', error);
    }
  });


// Function to clear existing images
function clearImages() {
    const imagesContainer = document.querySelector('.grid');
    imagesContainer.innerHTML = ''; // Clear existing images
    imagesData = []; // Clear existing images data
}

// Function to update UI with images data
function renderImages() {
    const imagesContainer = document.querySelector('.grid');
    imagesContainer.innerHTML = ''; // Clear previous images

    imagesData.forEach(image => {
        const imageElement = document.createElement('div');
        imageElement.classList.add('image');
        imageElement.innerHTML = `
            <img src="${image.urls.regular}" alt="${image.description}">
            <p>${image.user.username}</p>
        `;
        imagesContainer.appendChild(imageElement);
    });


    console.log('Images rendered successfully.'); // Log successful rendering of images
}


// Function to update UI with images data and attach click event listeners to images
async function updateImages() {
    try {
      // Fetch images data for the current page
      console.log('Fetching images data for query:', searchQuery, 'page:', currentPage); // Log fetching images data
      const newImagesData = await fetchData(searchQuery, currentPage);
      // Append new images to the existing ones
      imagesData = [...imagesData, ...newImagesData];
    //  clearImages(); // Clear existing images
     
  
      // Update UI with fetched data
      renderImages();

      console.log('Images data:', imagesData); // Log fetched images data
    } catch (error) {
      console.error('Error updating images:', error);
    }
  }

// Initial load - Fetch and render images
//updateImages();

  
