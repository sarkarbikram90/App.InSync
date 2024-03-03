import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faVideo,
  faDesktop,
  faVideoSlash,
  faMicrophoneSlash,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import "./MeetingFooter.css";

const MeetingFooter = (props) => {
  const [streamState, setStreamState] = useState({
    mic: true,
    video: false,
    screen: false,
  });
  const [message, setMessage] = useState("");
  const [text, setText] = useState(true);

  const micClick = () => {
    setStreamState((currentState) => ({
      ...currentState,
      mic: !currentState.mic,
    }));
  };

  const onVideoClick = () => {
    setStreamState((currentState) => ({
      ...currentState,
      video: !currentState.video,
    }));
  };

  const onScreenClick = () => {
    props.onScreenClick(setScreenState);
  };

  const setScreenState = (isEnabled) => {
    setStreamState((currentState) => ({
      ...currentState,
      screen: isEnabled,
    }));
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  return (
    <>
      <div className="meeting-footer">
        <div
          className={"meeting-icons " + (!streamState.mic ? "active" : "")}
          data-tip={streamState.mic ? "Mute Audio" : "Unmute Audio"}
          onClick={micClick}
        >
          <FontAwesomeIcon
            icon={!streamState.mic ? faMicrophoneSlash : faMicrophone}
            title="Mute"
          />
        </div>
        <div
          className={"meeting-icons " + (!streamState.video ? "active" : "")}
          data-tip={streamState.video ? "Hide Video" : "Show Video"}
          onClick={onVideoClick}
        >
          <FontAwesomeIcon
            icon={!streamState.video ? faVideoSlash : faVideo}
          />
        </div>
        <div
          className="meeting-icons"
          data-tip="Share Screen"
          onClick={onScreenClick}
          disabled={streamState.screen}
        >
          <FontAwesomeIcon icon={faDesktop} />
        </div>

        <div
          className="meeting-icons"
          data-tip="Send Message"
          onClick={() => props.onMessage(message)}
        >
          <FontAwesomeIcon icon={faEnvelopeOpenText} />
        </div>
      </div>
      <ReactTooltip />
    </>
  );
};

export default MeetingFooter;
