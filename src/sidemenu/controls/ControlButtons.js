import React, { useState, useEffect } from 'react';
import incrementQueueIndex from '../../helper/incrementQueueIndex';

function ControlButtons(props) {
    const {
        serverUrl,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        isPlaying,
        setIsPlaying,
        setnpSource,
        setnpArtist,
        setnpTitle,
    } = props;

    return (
        <div className="flex flex-row justify-between items-center">
            <PrevButton 
                serverUrl={serverUrl}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setIsPlaying={setIsPlaying}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpTitle={setnpTitle}
            />
            <PlayPauseButton 
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying} />
            <NextButton 
                serverUrl={serverUrl}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setIsPlaying={setIsPlaying}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpTitle={setnpTitle}
            />
        </div>
    );
}

function PrevButton(props) {
    const {
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ isFirstTrack, setIsFirstTrack ] = useState(true);

    useEffect(() => {
        if (implicitQueueTrackIndex <= 0 && implicitQueueDiscIndex <= 0) {
            setIsFirstTrack(true);
        } else {
            setIsFirstTrack(false);
        }
    }, [implicitQueueTrackIndex, implicitQueueDiscIndex]);

    const onClickPrevTrack = () => {
        if (implicitQueuePlaylist) {
            const discs = implicitQueuePlaylist.discs;
    
            if (implicitQueueTrackIndex > 0) {
                setImplicitQueueTrackIndex(implicitQueueTrackIndex - 1);
            } else {
                if (implicitQueueDiscIndex > 0) {
                    const prevDiscTracks = discs[implicitQueueDiscIndex - 1].tracks;

                    setImplicitQueueDiscIndex(implicitQueueDiscIndex - 1);
                    setImplicitQueueTrackIndex(prevDiscTracks.length - 1);
                }
            }
        }
        
    }

    return (
        <div onClick={onClickPrevTrack}
            className={`transition duration-300 ${isFirstTrack ? "text-gray-500 hover:cursor-default" : "text-slate-50 hover:cursor-pointer hover:text-amber-500"}`}>
            ⏮
        </div>
    );
}

function PlayPauseButton(props) {
    const {
        isPlaying,
        setIsPlaying,
    } = props;

    const onPlayPauseClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <button 
            onClick={onPlayPauseClick}
            className="font-mono font-medium text-3xl text-slate-50 md:hover:text-amber-500 transition duration-300">
            {isPlaying ? "⏸" : "▶"}
        </button>
    );
}

function NextButton(props) {
    const {
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ isLastTrack, setIsLastTrack ] = useState(true);

    useEffect(() => {
        if (implicitQueuePlaylist) {
            if (implicitQueueDiscIndex === implicitQueuePlaylist.discs.length - 1 && implicitQueueTrackIndex === implicitQueuePlaylist.discs[implicitQueueDiscIndex].tracks.length - 1) {
                setIsLastTrack(true);
            } else {
                setIsLastTrack(false);
            }
        }
    }, [implicitQueueTrackIndex, implicitQueueDiscIndex]);

    const onClickNextTrack = () => {
        const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
        setImplicitQueueDiscIndex(newDiscIndex);
        setImplicitQueueTrackIndex(newTrackIndex);
    }

    return (
        <div onClick={onClickNextTrack}
            className={`transition duration-300 ${isLastTrack ? "text-gray-500 hover:cursor-default" : "text-slate-50 hover:cursor-pointer hover:text-amber-500"}`}>
            ⏭
        </div>
    );
}

export {
    ControlButtons,
    PlayPauseButton,
}