import React from "react";
import secondsToTimeString from '../../misc/helper/secondsToTimeString';
import unwrapMetadata from "../../misc/helper/unwrapMetadata";

function Controller(props) {
    const {
        serverUrl,
        npTrack,
        npAlbum,
        audioRef,
        intervalRef,
        startInterval,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
    } = props;

    // get metadata
    const {
        artSource,
        title,
        artist,
        album,
    } = unwrapMetadata(serverUrl, npTrack, npAlbum);

    // duration seeker
    const duration = audioRef.current.duration;
    const onScrub = (s) => {
        // clear any current timers
        clearInterval(intervalRef.current);
        audioRef.current.currentTime = s;
        setTrackProgress(audioRef.current.currentTime);
    }
    const onScrubEnd = () => {
        // play on resume
        if (!isPlaying) {
            setIsPlaying(true);
        }
        startInterval();
    }

    return (
        <div className="flex flex-col bg-gray-500">
            <img 
                src={artSource} 
                alt={`Bigger front cover art for ${title} by ${artist} from the album ${album}`} 
                className={`object-contain w-14 h-14 2xl:w-20 2xl:h-20`} >
            </img>
            <div>
                <input
                    type="range"
                    value={trackProgress}
                    min={0}
                    step={1}
                    max={duration ? duration : `${duration}`}
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                />
                {secondsToTimeString(Math.floor(trackProgress))}/{duration ? secondsToTimeString(Math.floor(duration)) : `${duration}`}
            </div>
        </div>
    );
}

export default Controller;