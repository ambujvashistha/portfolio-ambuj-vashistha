import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_YT_API_KEY;
const CHANNEL_ID = "UCGIxGFeB6jbl5CEDqyU2axg";

export default function YoutubeFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`,
      );
      const data = await res.json();

      const vids = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
      }));
      console.log(data)
    //   console.log(API_KEY);
      setVideos(vids);
    }

    fetchVideos();
  }, []);

  return (
    <div className="grid">
      {videos.map((v) => (
        <div key={v.id} className="card">
          <img src={v.thumbnail} />
          <p style={{color:"white"}}>{v.title}</p>
        </div>
      ))}
    </div>
  );
}
