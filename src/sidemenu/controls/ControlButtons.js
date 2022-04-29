import React, { useState, useEffect } from 'react';
import { decrementQueueIndex, incrementQueueIndex } from '../../misc/helper/queueIndex';

function ControlButtons(props) {
    const {
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        isPlaying,
        setIsPlaying,
        setNewTrack,
        setNextTrack,
        setTabTitle,
        setnpTrack,
    } = props;

    return (
        <div className="flex flex-row justify-between items-center">
            <PrevButton 
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setNewTrack={setNewTrack}
                setTabTitle={setTabTitle}
                setnpTrack={setnpTrack}
            />
            <PlayPauseButton 
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying} />
            <NextButton 
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setNextTrack={setNextTrack}
                setTabTitle={setTabTitle}
                setnpTrack={setnpTrack}
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
        setNewTrack,
        setTabTitle,
        setnpTrack,
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
        const [ newDiscIndex, newTrackIndex ] = decrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
        if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
            setNewTrack(true);

            const newnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
            setnpTrack(newnpTrack);
            setTabTitle(`${newnpTrack.artist} - ${newnpTrack.name} | musicthing`);

            setImplicitQueueDiscIndex(newDiscIndex);
            setImplicitQueueTrackIndex(newTrackIndex);
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
        setNextTrack,
        setTabTitle,
        setnpTrack,
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
        if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
            setNextTrack(true);

            const nextnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
            setnpTrack(nextnpTrack);
            setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);

            setImplicitQueueDiscIndex(newDiscIndex);
            setImplicitQueueTrackIndex(newTrackIndex);
        }
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