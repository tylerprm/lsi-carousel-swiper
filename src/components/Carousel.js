import React from "react";
import Swiper from "swiper";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/swiper-bundle.css";

const Carousel = ({ children }) => {
  const mainSliderRef = React.useRef(null);
  const ytPlayers = React.useRef({});
  const vimeoPlayers = React.useRef({});

  const pauseAllVideos = (container) => {
    // Pausing self-hosted videos:
    const videos = container.querySelectorAll("video");
    videos.forEach((video) => video.pause());

    // Pausing YouTube videos:
    Object.values(ytPlayers.current).forEach((player) => {
      if (player && player.pauseVideo) {
        player.pauseVideo();
      }
    });

    // Pausing Vimeo videos:
    Object.values(vimeoPlayers.current).forEach((player) => {
      if (player && player.pause) {
        player.pause();
      }
    });
  };

  React.useEffect(() => {
    Swiper.use([Navigation, Thumbs]);

    React.Children.forEach(children, (child) => {
      const mediaType = getMediaType(child);
      if (mediaType === "youtube") {
        const videoId = new URL(child.props.src).searchParams.get("v");
        if (!window.YT) {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(tag);
          window.onYouTubeIframeAPIReady = () => {
            ytPlayers.current[videoId] = new window.YT.Player(videoId, {
              events: {
                onReady: (event) => {
                  ytPlayers.current[videoId] = event.target;
                },
              },
            });
          };
        } else if (window.YT && window.YT.Player) {
          ytPlayers.current[videoId] = new window.YT.Player(videoId, {
            events: {
              onReady: (event) => {
                ytPlayers.current[videoId] = event.target;
              },
            },
          });
        }
      }

      // Initialize Vimeo players
      if (mediaType === "vimeo") {
        const videoId = child.props.src.split("/").pop();
        if (!window.Vimeo) {
          const tag = document.createElement("script");
          tag.src = "https://player.vimeo.com/api/player.js";
          document.body.appendChild(tag);
          tag.onload = () => {
            vimeoPlayers.current[videoId] = new window.Vimeo.Player(videoId);
          };
        } else {
          vimeoPlayers.current[videoId] = new window.Vimeo.Player(videoId);
        }
      }
    });

    let thumbsSlider = new Swiper(".thumbs-slider", {
      slidesPerView: "auto",
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
    });

    const mainSwiper = new Swiper(".main-slider", {
      slidesPerView: 1,
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      thumbs: {
        swiper: thumbsSlider,
      },
      on: {
        slideChangeTransitionStart: () => {
          pauseAllVideos(mainSliderRef.current);
        },
      },
    });
    return () => {
      mainSwiper.destroy();
      thumbsSlider.destroy();
    };
  }, []);

  const getMediaType = (source) => {
    const src = source.props.src;
    if (src.includes("youtube.com") || src.includes("youtu.be"))
      return "youtube";
    if (src.includes("vimeo.com")) return "vimeo";
    if ([".mp4", ".webm", ".ogg"].some((ext) => src.endsWith(ext)))
      return "video";
    return "image";
  };

  return (
    <div className="main-swiper-container">
      <div ref={mainSliderRef} className="swiper-container main-slider">
        <div className="swiper-wrapper">
          {React.Children.map(children, (child, index) => {
            const mediaType = getMediaType(child);
            let content;

            switch (mediaType) {
              case "image":
                content = (
                  <img
                    className="carousel-image"
                    src={child.props.src}
                    alt=""
                  />
                );
                break;
              case "video":
                content = (
                  <video controls>
                    <source
                      src={child.props.src}
                      type={`video/${child.type}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                );
                break;
              case "youtube":
                const ytVideoId = new URL(child.props.src).searchParams.get(
                  "v"
                );
                content = (
                  <iframe
                    id={ytVideoId}
                    width="100%"
                    height="100%"
                    controls="0"
                    src={`https://www.youtube.com/embed/${ytVideoId}?enablejsapi=1&modestbranding=1&rel=0&controls=0`}
                    allowFullScreen
                  ></iframe>
                );
                break;
              case "vimeo":
                const vimeoVideoId = child.props.src.split("/").pop();
                content = (
                  <iframe
                    id={vimeoVideoId}
                    src={`https://player.vimeo.com/video/${vimeoVideoId}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                );
                break;
              default:
                content = null;
            }

            return (
              <div className="swiper-slide" key={index}>
                {content}
              </div>
            );
          })}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-button-prev"></div>
      </div>

      <div className="swiper-container thumbs-slider">
        <div className="swiper-wrapper">
          {React.Children.map(children, (child, index) => {
            const mediaType = getMediaType(child);
            let content;

            switch (mediaType) {
              case "image":
                content = (
                  <img
                    className="carousel-image"
                    src={child.props.src}
                    alt=""
                  />
                );
                break;
              case "video":
                content = (
                  <video controls>
                    <source
                      src={child.props.src}
                      type={`video/${child.type}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                );
                break;
              case "youtube":
                const ytVideoId = new URL(child.props.src).searchParams.get(
                  "v"
                );
                content = (
                  <img
                    src={`https://img.youtube.com/vi/${ytVideoId}/1.jpg`}
                    width="100%"
                    height="100%"
                  ></img>
                );
                break;
              case "vimeo":
                const vimeoVideoId = child.props.src.split("/").pop();
                content = (
                  <iframe
                    id={`vimeo-${vimeoVideoId}`}
                    src={`https://player.vimeo.com/video/${vimeoVideoId}?controls=0&showinfo=0&autohide=1`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                );
                break;
              default:
                content = null;
            }

            return (
              <div className="swiper-slide" key={index}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
