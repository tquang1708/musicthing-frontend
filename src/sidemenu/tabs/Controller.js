import React from "react";
import { HashLink } from "react-router-hash-link";
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

    //on click hide mobile menu
    const onClickGoBack = () => {
        if (!onBigScreen) {
            setBottomMenuContentVisible(false);
        }
    };

    const scrollWithOffset = (e) => {
        const yCoords = e.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: yCoords, behavior: "smooth"})
    }

    return (
        <div className="flex flex-col bg-gray-500 mt-2 w-screen md:w-auto">
            <div className="h-8 md:hidden"></div>
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
                    onTouchEnd={onScrubEnd}
                    disabled={duration ? false : true}
                    className={"grow hover:cursor-pointer mx-4 mb-1"}
            />
            <div className="font-semibold text-2xl 2xl:text-3xl text-center text-slate-50">
                {secondsToTimeString(Math.floor(trackProgress))} / {duration ? secondsToTimeString(Math.floor(duration)) : "00:00"}
            </div>
            <ControlButtons 
                fontSize={onBigScreen ? (onBiggerScreen ? "5rem" : "4rem") : "3.5rem"}
                gapSide={onBigScreen ? "2rem" : "3rem"}
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
                className={`text-left font-bold text-xl md:text-3xl 2xl:text-4xl mx-1.5 2xl:mx-2.5 mb-1.5 break-words`}>
                {title}
            </p>
            <p style={{"color": `${currTheme.textColor}`}}
                className={`text-left font-medium text-xl md:text-3xl 2xl:text-4xl mx-1.5 2xl:mx-2.5 mb-1.5 break-words`}>
                {artist}
            </p>
            <HashLink to={npAlbum ? `/album/${npAlbum.id}#${npTrack.id}playing` : "/album"}
                onClick={onClickGoBack}
                scroll={scrollWithOffset}
                style={{"color": `${currTheme.textColor}`}}
                className={`text-left font-light text-xl md:text-3xl 2xl:text-4xl mx-1.5 2xl:mx-2.5 mb-1.5 break-words hover:cursor-pointer hover:underline hover:decoration-solid`} >
                {album}
            </HashLink>
        </div>
    );
}

export default Controller;