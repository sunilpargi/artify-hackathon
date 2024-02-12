export function updateSubtitle(query) {
    const subtitle = document.querySelector(".subtitle");
    if (query === "My Favorites") {
      subtitle.textContent = query;
    } else {
      subtitle.textContent =
        query === "Random Images"
          ? "Random Images"
          : `Results for ${query}`;
    }
  }
  
  export function updateImageHoverUI(imageElement, imageData) {
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
  
  export function clearImageHoverUI(imageElement) {
    const profileInfo = imageElement.querySelector("#profile-info");
    if (profileInfo) {
      profileInfo.remove();
    }
  }
  