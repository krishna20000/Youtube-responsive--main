
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

  function isIndianChannel(channelTitle) {
    const indianKeywords = ["India", "Bollywood", "Desi", "Hindi", "Tamil", "Telugu", "Bengali"];
    return indianKeywords.some(keyword => channelTitle.toLowerCase().includes(keyword.toLowerCase()));
}



  // Fetch & Display Most Popular Videos (Default)
  async function fetchVideos(query = "") {
    showLoader();
    videoContainer.innerHTML = "";
    
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&key=${API_KEY}&regionCode=IN`;

    if (query) {
        url += `&chart=mostPopular&regionCode=IN`;
    } else {
        url += `&chart=mostPopular&regionCode=IN`;
    }



    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log("API Response:", data); // Debugging

        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            videoContainer.innerHTML = `<p style="color: red;">Error: ${data.error.message}</p>`;
            return;
        }

        if (data.items && data.items.length > 0) {
            const videoIds = data.items.map(video => video.id.videoId).join(",");
            if (videoIds) {
                fetchVideoDetails(videoIds, data.items);  // ✅ Fetch video durations
            } else {
                displayVideos(data.items, {}); // No duration available
            }
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


  // Convert ISO 8601 duration to readable formatasync function fetchVideoDetails(videoIds, videos) {
    async function fetchVideoDetails(videoIds, videos) {
        let url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}&regionCode=IN`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data.items && data.items.length > 0) {
                const durations = {};
                data.items.forEach(video => {
                    durations[video.id] = convertDuration(video.contentDetails.duration);
                });
    
                displayVideos(videos, durations);
            }
        } catch (error) {
            console.error("Error fetching video details:", error);
        }
    }
    

    function convertDuration(isoDuration) {
        if (!isoDuration) return "00:00"; // Handle null or undefined input
    
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = isoDuration.match(regex);
    
        if (!matches) return "Live"; // Handle invalid duration format

        
    
        const hours = matches[1] ? parseInt(matches[1]) : 0;
        const minutes = matches[2] ? parseInt(matches[2]) : 0;
        const seconds = matches[3] ? parseInt(matches[3]) : 0;
    
        return `${hours > 0 ? (hours < 10 ? "0" + hours + ":" : hours + ":") : ""}${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    }
    
  



  // Display Videos in Grid
  function displayVideos(videos, durations) {
    videoContainer.innerHTML = "";
    videos.forEach(video => {
        if (!video.id.videoId) return;

        const duration = durations[video.id.videoId] || "N/A"; // Get duration from fetched data

        const videoElement = document.createElement("div");
        videoElement.classList.add("video-card");
        videoElement.innerHTML = `
            <a href="video.html?videoId=${video.id.videoId}">
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            </a>
            <div class="videotimex">
                <div class="videotime">${duration}</div>
            </div>
            <h3>${video.snippet.title}</h3>
            <p class="channel-name">${video.snippet.channelTitle}</p>
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
