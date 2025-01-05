import React, { useState, useRef, useEffect } from "react";
import "./styles.scss"; // Import your CSS file
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchDataFromApi } from "../../store/actions";
import fluidPlayer from "fluid-player";

const VideoPlayer = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [videosData, setVideosData] = useState();
  const [videosLoading, setVideosLoading] = useState(false);
  const videoRef = useRef(null);
  const [isSkip, setIsSkip] = useState(false);
  useEffect(() => {
    setVideosLoading(true);
    dispatch(
      fetchDataFromApi(
        `/movies/movie/${id}/videos`,
        {},
        (res) => {
          setVideosData(res);
          setVideosLoading(false);
        },
        () => {
          setVideosLoading(false);
        }
      )
    );
  }, [id]);

  useEffect(() => {
    // Initialize Fluid Player
    var myFP = fluidPlayer("video-id", {
      layoutControls: {
        controlBar: {
          autoHideTimeout: 3,
          animated: true,
          autoHide: true,
        },
        htmlOnPauseBlock: {
          html: null,
          height: "",
          width: null,
        },
        autoPlay: true,
        mute: true,
        allowTheatre: false,
        playPauseAnimation: true,
        playbackRateEnabled: true,
        allowDownload: false,
        playButtonShowing: true,
        fillToContainer: false,
        posterImage: "",
      },
      vastOptions: {
        adList: [],
        adCTAText: false,
        adCTATextPosition: "",
      },
    });

    // Store the player instance globally if needed
    window.myFP = myFP;
  }, []);
  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleTimeUpdate = () => {
        if (videoElement.currentTime >= 60) {
          setIsSkip(true);
        } else {
          setIsSkip(false);
        }
      };

      // Add the timeupdate event listener
      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      // Cleanup the event listener when the component unmounts
      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  const handleSkip = () => {
    const player = window.myFP;

    if (player) {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;

        if (currentTime < 60) {
          player.skipTo(60);
          setIsSkip(true);
        } else {
          setIsSkip(true);
        }
      }
    }
  };

  return (
    <>
      <div key="uniqueKey" className="video-wrapper">
        {/* https://www.youtube.com/watch?v=${videosData?.results?.[0]?.key} */}
        <video
          id="video-id"
          ref={videoRef}
          autoPlay={true}
          style={{ width: "100vw", height: "100vh" }}
          onChange={handleSkip}
        >
          <source
            src="https://content.jwplatform.com/videos/BPr16NTj-liGZ8Ry2.mp4"
            type="video/mp4"
          />
        </video>
        {!isSkip ? (
          <div className="skip-btn" onClick={handleSkip}>
            SKIP INTRO
          </div>
        ) : null}
      </div>
    </>
  );
};

export default VideoPlayer;
