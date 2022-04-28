import React from "react";
import secondsToTimeString from '../../helper/secondsToTimeString'

function Controller(props) {
    const {
        audioRef,
        intervalRef,
        startInterval,
        trackProgress,
        setTrackProgress,
        isPlaying,
        setIsPlaying,
    } = props;

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
        <div className="bg-gray-500">
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