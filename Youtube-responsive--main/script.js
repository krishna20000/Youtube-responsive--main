import { API_KEY } from "./config.js"; 

document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu functionality
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const LoaderEl = document.getElementById("loader");
  const homeEl = document.getElementById("home");
  const trendingEl = document.getElementById("trending");
  const exploreEl = document.getElementById("explore");
  const subscriptionsEl = document.getElementById("subscriptions");
  const originalsEl = document.getElementById("originals");
  const musicEl = document.getElementById("music");
  const libraryEl = document.getElementById("library");
  const gridEl = document.getElementById("video-container");
  const categoryEl = document.getElementById("category");
  const userProfile = document.getElementById("user-profile");
  const loginForm = document.getElementById("login-form");
  const logoutBtn = document.getElementById("logout-btn");
  const loginBtn = document.getElementById("login-btn");


  hamburger.addEventListener("click", function () {
    sidebar.classList.toggle("expanded");
    gridEl.classList.toggle("minimize");
    categoryEl.classList.toggle("minimize");
    
});

homeEl.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  gridEl.classList.toggle("minimize");
  categoryEl.classList.toggle("minimize");
});

trendingEl.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  gridEl.classList.toggle("minimize");
  categoryEl.classList.toggle("minimize");
});

exploreEl.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  gridEl.classList.toggle("minimize");
  categoryEl.classList.toggle("minimize");
});

subscriptionsEl.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  gridEl.classList.toggle("minimize");
  categoryEl.classList.toggle("minimize");
});

originalsEl.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  gridEl.classList.toggle("minimize");
  categoryEl.classList.toggle("minimize");
});

musicEl.addEventListener("click", function () {
  sidebar.classList.toggle("expanded");
  gridEl.classList.toggle("minimize");
  categoryEl.classList.toggle("minimize");
});



  libraryEl.addEventListener("click", function () {
      sidebar.classList.toggle("expanded");
      gridEl.classList.toggle("minimize");
      categoryEl.classList.toggle("minimize");
  });



  // YouTube API Configuration
  const videoContainer = document.getElementById("video-container");
  const searchInput = document.querySelector(".search");
  const searchButton = document.querySelector(".search-but");

  function showLoader() {
      LoaderEl.style.display = "block";
  }

  function hideLoader() {
      LoaderEl.style.display = "none";
  }

  // Fetch & Display Most Popular Videos (Default)
  async function fetchVideos(query = "") {
      showLoader();
      videoContainer.innerHTML = "";
      
      let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&key=${API_KEY}`;

      if (query) {
          url += `&q=${encodeURIComponent(query)}`;
      } else {
          url += `&chart=mostPopular&regionCode=IN`;
      }

      try {
          const response = await fetch(url);
          const data = await response.json();

          console.log("API Response:", data); // Debugging line

          if (data.error) {
              console.error("YouTube API Error:", data.error.message);
              videoContainer.innerHTML = `<p style="color: red;">Error: ${data.error.message}</p>`;
              return;
          }

          if (data.items && data.items.length > 0) {
              displayVideos(data.items);
          } else {
              console.error("No videos found:", data);
              videoContainer.innerHTML = `<p>No videos found.</p>`;
          }

      } catch (error) {
          console.error("Error fetching videos:", error);
          videoContainer.innerHTML = `<p style="color: red;">Failed to load videos.</p>`;
      } finally {
          hideLoader();
      }
  }

  // Display Videos in Grid
  function displayVideos(videos) {
      videoContainer.innerHTML = ""; // Clear previous results
      videos.forEach(video => {
          if (!video.id.videoId) return; // Ensure videoId exists

          const videoElement = document.createElement("div");
          videoElement.classList.add("video-card");
          videoElement.innerHTML = `
              <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                  <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
              </a>
              <h3>${video.snippet.title}</h3>
              <p class="channel-name">${video.snippet.channelTitle}</p>
            <p class="video-description">${video.snippet.description.substring(0, 100)}...</p>
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

  document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", function () {
        document.querySelector(".category.active").classList.remove("active");
        this.classList.add("active");
        
        let query = this.getAttribute("data-query");
        fetchVideos(query); 
    });
});


  // Load Default Videos
  fetchVideos();
});
