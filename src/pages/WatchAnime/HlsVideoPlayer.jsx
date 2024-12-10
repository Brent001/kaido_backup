import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsVideoPlayer({ url, headers }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const proxyUrl = `https://goodproxy.goodproxy.workers.dev/fetch?url=${encodeURIComponent(
        url
      )}`;
      const hls = new Hls();
      hls.loadSource(proxyUrl);
      hls.attachMedia(videoRef.current);

      hls.config.xhrSetup = function (xhr) {
        if (headers) {
          Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }
      };

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
      });

      return () => {
        hls.destroy();
      };
    } else {
      console.error("HLS is not supported in this browser.");
    }
  }, [url, headers]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "f" || event.key === "F") {
        toggleFullScreen();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} controls className="video-player">
        Your browser does not support HLS video. Please try a different browser.
      </video>
    </div>
  );
}
