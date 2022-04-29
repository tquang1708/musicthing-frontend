import React, { useState, useEffect } from 'react';
import { incrementQueueIndex, decrementQueueIndex } from '../../misc/helper/queueIndex';

function ControlButtons(props) {
    const {
        explicitQueue,
        setExplicitQueue,
        inExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        isPlaying,
        setIsPlaying,
        setNewTrack,
        setTabTitle,
        setnpTrack,
    } = props;

    return (
        <div className="flex flex-row justify-between items-center">
            <PrevButton 
                inExplicitQueue={inExplicitQueue}
                setInExplicitQueue={setInExplicitQueue}
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
                setIsPlaying={setIsPlaying} 
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                inExplicitQueue={inExplicitQueue}
                setInExplicitQueue={setInExplicitQueue}
                implicitQueuePlaylist={implicitQueuePlaylist}
                setNewTrack={setNewTrack}
                setnpTrack={setnpTrack}
                setTabTitle={setTabTitle}
            />
            <NextButton 
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                setInExplicitQueue={setInExplicitQueue}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setNewTrack={setNewTrack}
                setTabTitle={setTabTitle}
                setnpTrack={setnpTrack}
            />
        </div>
    );
}

function PrevButton(props) {
    const {
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
    } = props;
    const [ isFirstTrack, setIsFirstTrack ] = useState(true);

    useEffect(() => {
        if (!inExplicitQueue) {
            if (implicitQueueTrackIndex <= 0 && implicitQueueDiscIndex <= 0) {
                setIsFirstTrack(true);
            } else {
                setIsFirstTrack(false);
            }
        } else {
            // in explicit queue - first track means no implicit queue since ur alw at the top of an explicit queue
            if (!implicitQueuePlaylist) {
                setIsFirstTrack(true)
            } else {
                setIsFirstTrack(false);
            }
        }
    }, [inExplicitQueue, implicitQueueTrackIndex, implicitQueueDiscIndex]);

    const onClickPrevTrack = () => {
        let newnpTrack = null;

        if (inExplicitQueue) {
            // dont update implicit queue index while exiting out of explicit queue
            newnpTrack = implicitQueuePlaylist.discs[implicitQueueDiscIndex].tracks[implicitQueueTrackIndex];
            setInExplicitQueue(false);
        } else {
            const [ newDiscIndex, newTrackIndex ] = decrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
            if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
                newnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
                setImplicitQueueDiscIndex(newDiscIndex);
                setImplicitQueueTrackIndex(newTrackIndex);
            }
        }

        if (newnpTrack) {
            setNewTrack(true);
            setnpTrack(newnpTrack);
            setTabTitle(`${newnpTrack.artist} - ${newnpTrack.name} | musicthing`);
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
        explicitQueue,
        setExplicitQueue,
        inExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        setNewTrack,
        setnpTrack,
        setTabTitle,
    } = props;

    const onPlayPauseClick = () => {
        // if there is nothing in the implicit queue and something in the explicit queue play the first track there
        if (!implicitQueuePlaylist && !inExplicitQueue && explicitQueue.length > 0) {
            let newExplicitQueue = [...explicitQueue];
            const nextnpTrack = newExplicitQueue.pop();
            setExplicitQueue(newExplicitQueue);
            setInExplicitQueue(true);
    
            setNewTrack(true);
            setnpTrack(nextnpTrack);
            setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        } else {
            setIsPlaying(!isPlaying);
        }
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
        explicitQueue,
        setExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        setNewTrack,
        setTabTitle,
        setnpTrack,
    } = props;
    const [ isLastTrack, setIsLastTrack ] = useState(true);

    useEffect(() => {
        if (explicitQueue.length === 0) {
            if (!implicitQueuePlaylist) {
                setIsLastTrack(true);
            } else {
                if (implicitQueueDiscIndex === implicitQueuePlaylist.discs.length - 1 && implicitQueueTrackIndex === implicitQueuePlaylist.discs[implicitQueueDiscIndex].tracks.length - 1) {
                    setIsLastTrack(true);
                } else {
                    setIsLastTrack(false);
                }
            }
        } else {
            setIsLastTrack(false);
        }
    }, [implicitQueueTrackIndex, implicitQueueDiscIndex, explicitQueue]);

    const onClickNextTrack = () => {
        let nextnpTrack = null;

        // consume explicit queue first
        if (explicitQueue.length > 0) {
            let newExplicitQueue = [...explicitQueue];
            nextnpTrack = newExplicitQueue.pop();
            setExplicitQueue(newExplicitQueue);
            setInExplicitQueue(true);
        } else {
            setInExplicitQueue(false);
            const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
            if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
                nextnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
                setImplicitQueueDiscIndex(newDiscIndex);
                setImplicitQueueTrackIndex(newTrackIndex);
            }
        }

        if (nextnpTrack) {
            setNewTrack(true);
            setnpTrack(nextnpTrack);
            setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        }
    };

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