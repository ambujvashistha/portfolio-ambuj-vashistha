import { useEffect, useState } from "react";
import InfiniteMenu from "../components/infiniteMenu";

const API_KEY = import.meta.env.VITE_YT_API_KEY;
const CHANNEL_ID = "UCGIxGFeB6jbl5CEDqyU2axg";

export default function YoutubeFeed() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20&type=video`,
      );
      const data = await res.json();

      const vids = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        image: item.snippet.thumbnails.high.url,
        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      }));
      console.log(data)
    //   console.log(API_KEY);
    console.log(vids)
      setVideos(vids);
    }

    fetchVideos();
  }, []);

  return (
      <InfiniteMenu items={videos} number={3} />
   
  );
}
