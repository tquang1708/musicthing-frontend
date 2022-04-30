import React from "react";
import secondsToTimeString from '../../misc/helper/secondsToTimeString';
import unwrapMetadata from "../../misc/helper/unwrapMetadata";
import { ControlButtons } from "../controls/ControlButtons";

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
        onBiggerScreen,
        isPlaying,
        setIsPlaying,
        explicitQueue,
        setExplicitQueue,
        inExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        setNewTrack,
        setTabTitle,
        setnpTrack,
        setnpAlbum,
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
        <div className="flex flex-col bg-gray-500 mt-2">
            <img 
                src={artSource} 
                alt={`Bigger front cover art for ${title} by ${artist} from the album ${album}`} 
                className={`object-contain mx-2 mb-2 w-38 2xl:w-56 h-38 2xl:h-56 bg-gray-700`} >
            </img>
            <input
                    type="range"
                    value={trackProgress}
                    min={0}
                    step={1}
                    max={duration ? duration : `${duration}`}
                    onChange={(e) => onScrub(e.target.value)}
                    onMouseUp={onScrubEnd}
                    onKeyUp={onScrubEnd}
                    disabled={duration ? false : true}
                    className={"grow hover:cursor-pointer mx-4 mb-1"}
            />
            <div className="font-semibold text-2xl 2xl:text-3xl text-center text-slate-50">
                {secondsToTimeString(Math.floor(trackProgress))} / {duration ? secondsToTimeString(Math.floor(duration)) : "00:00"}
            </div>
            <ControlButtons 
                fontSize={onBiggerScreen ? "5rem" : "4rem"}
                gapSide={"2rem"}
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                inExplicitQueue={inExplicitQueue}
                setInExplicitQueue={setInExplicitQueue}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                setNewTrack={setNewTrack}
                setTabTitle={setTabTitle}
                setnpTrack={setnpTrack}
                setnpAlbum={setnpAlbum}
            />
        </div>
    );
}

export default Controller;