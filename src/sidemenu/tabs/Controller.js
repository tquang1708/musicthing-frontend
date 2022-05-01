import React from "react";
import { useNavigate } from "react-router-dom";
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
        onBigScreen,
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
        setBottomMenuContentVisible,
        currTheme,
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

    //on click navigate. also hide mobile menu
    const navigate = useNavigate();
    const onClickGoBack = () => {
        navigate(npAlbum ? `/album/${npAlbum.id}` : "/album");
        if (!onBigScreen) {
            setBottomMenuContentVisible(false);
        }
    };

    return (
        <div className="flex flex-col bg-gray-500 mt-2 w-screen md:w-auto">
            <img 
                src={artSource} 
                alt={`Bigger front cover art for ${title} by ${artist} from the album ${album}`} 
                className={`flex self-center object-contain mb-2 w-38 2xl:w-56 h-38 2xl:h-56 bg-gray-700`} >
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
            <p style={{"color": `${currTheme.textColor}`}}
                className={`text-left font-bold text-3xl 2xl:text-4xl mx-1.5 2xl:mx-2.5 mb-1.5 break-words`}>
                {title}
            </p>
            <p style={{"color": `${currTheme.textColor}`}}
                className={`text-left font-medium text-3xl 2xl:text-4xl mx-1.5 2xl:mx-2.5 mb-1.5 break-words`}>
                {artist}
            </p>
            <div style={{"color": `${currTheme.textColor}`}}
                onClick={onClickGoBack}
                className={`text-left font-light text-3xl 2xl:text-4xl mx-1.5 2xl:mx-2.5 mb-1.5 break-words hover:cursor-pointer hover:underline hover:decoration-solid`}>
                {album}
            </div>
        </div>
    );
}

export default Controller;