export async function fetchData(query, page) {
    try {
      const clientId = "g8_qoQKYdMbsTV5sFCGQDtDZrJZGDAvfUDjElBoNvdE";
      const perPage = 12;
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
  
  export async function fetchRandomImages() {
    try {
      const clientId = "g8_qoQKYdMbsTV5sFCGQDtDZrJZGDAvfUDjElBoNvdE";
      const perPage = 15;
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=${perPage}&client_id=${clientId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching random images:", error);
      return [];
    }
  }
  
  export async function updateImages() {
    try {
      const newImagesData = await fetchData(searchQuery, currentPage);
      imagesData = [...imagesData, ...newImagesData];
      updateSubtitle(searchQuery);
      renderImages();
    } catch (error) {
      console.error("Error updating images:", error);
    }
  }
  
  export function clearImages() {
    const imagesContainer = document.querySelector(".grid");
    imagesContainer.innerHTML = "";
    imagesData = [];
  }
  