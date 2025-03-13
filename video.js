import { API_KEY } from "./config.js";

// Extract videoId from the URL
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get("videoId");

// Display Video in the iframe
if (videoId) {
    document.getElementById("videoPlayer").src = `https://www.youtube.com/embed/${videoId}`;
} else {
    document.getElementById("video-container").innerHTML = "<p>Video not found</p>";
}

// Fetch Video Details from YouTube API
async function fetchVideoDetails(videoId) {
    let apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        let video = data.items[0];

        if (!video) {
            console.error("Video not found");
            return;
        }

        document.getElementById("videoTitle").textContent = video.snippet.title;
        document.getElementById("channelName").textContent = `Channel: ${video.snippet.channelTitle}`;
        document.getElementById("videoViews").textContent = `👁️ ${video.statistics.viewCount} views`;
        document.getElementById("videoLikes").textContent = `👍 ${video.statistics.likeCount} likes`;

        let description = video.snippet.description;
        let videoDescriptionElement = document.getElementById("videoDescription");
        let readMoreBtn = document.getElementById("readMoreBtn");

        if (description.length > 150) {
            videoDescriptionElement.textContent = description.substring(0, 150) + "...";
            readMoreBtn.style.display = "inline-block";

            readMoreBtn.onclick = function () {
                videoDescriptionElement.textContent = description;
                readMoreBtn.style.display = "none"; // Hide button after clicking
            };
        } else {
            videoDescriptionElement.textContent = description;
        }
    } catch (error) {
        console.error("Error fetching video details:", error);
    }
}

// Load Video & Details on Page Load
window.onload = function () {
    if (videoId) {
        fetchVideoDetails(videoId);
        fetchRecommendedVideos();
        loadComments();
    }
};

// Comment Section Code
let commentsContainer = document.getElementById("commentList");
let addCommentButton = document.getElementById("addCommentButton");

// Fetch comments from localStorage
function getCommentsFromLocalStorage() {
    let storedComments = localStorage.getItem(`comments-${videoId}`);
    return storedComments ? JSON.parse(storedComments) : [];
}

let commentList = getCommentsFromLocalStorage();

// Save comments to localStorage
function saveCommentsToLocalStorage() {
    localStorage.setItem(`comments-${videoId}`, JSON.stringify(commentList));
}

// Add a new comment
function onAddComment() {
    let commentInput = document.getElementById("commentInput");
    let commentText = commentInput.value.trim();

    if (commentText === "") {
        alert("Enter a valid comment");
        return;
    }

    let newComment = {
        text: commentText,
        uniqueId: Date.now()
    };

    // Add to comment list without affecting video
    commentList.push(newComment);
    saveCommentsToLocalStorage();
    createAndAppendComment(newComment);

    commentInput.value = "";
}

// Delete a comment
function onDeleteComment(commentId) {
    let commentElement = document.getElementById(commentId);
    commentsContainer.removeChild(commentElement);

    commentList = commentList.filter(comment => "comment" + comment.uniqueId !== commentId);
    saveCommentsToLocalStorage();
}

// Create and append comment
function createAndAppendComment(comment) {
    let commentId = "comment" + comment.uniqueId;

    let commentElement = document.createElement("li");
    commentElement.classList.add("comment-item");
    commentElement.id = commentId;

    let commentTextElement = document.createElement("span");
    commentTextElement.classList.add("comment-text");
    commentTextElement.textContent = comment.text;

    let deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-comment");

    // Font Awesome Trash Icon
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt");

    deleteButton.appendChild(deleteIcon);
    deleteButton.onclick = function () {
        onDeleteComment(commentId);
    };

    commentElement.appendChild(commentTextElement);
    commentElement.appendChild(deleteButton);
    commentsContainer.appendChild(commentElement);
}

// Load existing comments on page load
function loadComments() {
    commentsContainer.innerHTML = "";
    for (let comment of commentList) {
        createAndAppendComment(comment);
    }
}

// Prevent page reload when clicking add comment button
document.getElementById("addCommentButton").addEventListener("click", function (event) {
    event.preventDefault(); // ✅ Stops page reload
    onAddComment();
});

// Fetch recommended videos
async function fetchRecommendedVideos() {
    let apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&relatedToVideoId=${videoId}&key=${API_KEY}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        let recommendedVideos = document.getElementById("recommendedVideos");
        recommendedVideos.innerHTML = ""; // ✅ Clear previous recommendations

        data.items.forEach(video => {
            if (!video.id.videoId) return; // ✅ Ensure it has a valid video ID

            let videoItem = document.createElement("li");
            videoItem.classList.add("recommended-video");

            videoItem.innerHTML = `
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <div>
                    <h4>${video.snippet.title}</h4>
                    <p>${video.snippet.channelTitle}</p>
                </div>
            `;

            videoItem.onclick = function () {
                window.location.href = `video.html?videoId=${video.id.videoId}`;
            };

            recommendedVideos.appendChild(videoItem);
        });
    } catch (error) {
        console.error("Error fetching recommended videos:", error);
    }
}
