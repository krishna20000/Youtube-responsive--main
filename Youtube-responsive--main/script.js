document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu functionality
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");

  hamburger.addEventListener("click", function () {
      sidebar.classList.toggle("expanded");
  });

  // YouTube API Configuration
  const API_KEY = "YOUR_API_KEY"; // Replace with your API Key
  const videoContainer = document.getElementById("video-container");
  const searchInput = document.querySelector(".search"); // Search input field
  const searchButton = document.querySelector(".search-but"); // Search button

  // Fetch & Display Most Popular Videos (Default)
  async function fetchVideos(query = "") {
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&type=video&key=${API_KEY}`;

      if (query) {
          url += `&q=${encodeURIComponent(query)}`; // Search for the query
      } else {
          url += `&chart=mostPopular&regionCode=IN`; // Default popular videos
      }

      try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.items) {
              displayVideos(data.items);
          } else {
              console.error("No videos found:", data);
          }
      } catch (error) {
          console.error("Error fetching videos:", error);
      }
  }

  // Display Videos in Grid
  function displayVideos(videos) {
      videoContainer.innerHTML = ""; // Clear previous results
      videos.forEach(video => {
          const videoElement = document.createElement("div");
          videoElement.classList.add("video-card");
          videoElement.innerHTML = `
              <a href="https://www.youtube.com/watch?v=${video.id.videoId || video.id}" target="_blank">
                  <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
              </a>
              <h3>${video.snippet.title}</h3>
          `;
          videoContainer.appendChild(videoElement);
      });
  }

  // Event Listeners for Search
  searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) {
          fetchVideos(query);
      }
  });

  searchInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
          const query = searchInput.value.trim();
          if (query) {
              fetchVideos(query);
          }
      }
  });

  // Load Default Videos
  fetchVideos();
});
