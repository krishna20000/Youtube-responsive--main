export default async function handler(req, res) {
  const { videoId } = req.query;
  const API_KEY = process.env.YOUTUBE_API_KEY; // 🔒 Secure API Key

  if (!videoId) {
      return res.status(400).json({ error: "Missing videoId parameter" });
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&relatedToVideoId=${videoId}&key=${API_KEY}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch YouTube data" });
  }
}
