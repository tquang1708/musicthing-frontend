import React, { useState, useEffect } from 'react';
import { incrementQueueIndex, decrementQueueIndex } from '../../misc/helper/queueIndex';

function ControlButtons(props) {
    const {
        fontSize,
        gapSide,
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
        setnpAlbum,
    } = props;

    return (
        <div style={{"fontSize": `${fontSize}`, "marginLeft": `${gapSide}`, "marginRight": `${gapSide}`}} 
            className={`flex flex-row justify-between items-baseline`}>
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
                setnpAlbum={setnpAlbum}
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
                setnpAlbum={setnpAlbum}
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
                setnpAlbum={setnpAlbum}
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
        setnpAlbum,
    } = props;
    const [ isFirstTrack, setIsFirstTrack ] = useState(true);
    // const [ isHover, setIsHover ] = useState(false);

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
        let newnpAlbum = null;

        if (inExplicitQueue) {
            // dont update implicit queue index while exiting out of explicit queue
            newnpTrack = implicitQueuePlaylist.discs[implicitQueueDiscIndex].tracks[implicitQueueTrackIndex];
            newnpAlbum = implicitQueuePlaylist;
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
            if (newnpAlbum) {
                setnpAlbum(newnpAlbum);
            }
        }
    }

    // const onEnterEnableHover = () => setIsHover(true);
    // const onLeaveDisableHover = () => setIsHover(false);

    return (
        <div onClick={onClickPrevTrack}
            // onMouseEnter={onEnterEnableHover}
            // onMouseLeave={onLeaveDisableHover}
            // style={{color: `${isHover ? "var(--select-color)" : "var(--highlight-color)"}`}}
            className={`select-none transition duration-300 ${isFirstTrack ? "text-gray-600 hover:cursor-default" : "text-slate-50 hover:cursor-pointer hover:text-amber-500"}`}>
            ⏮&#xFE0E;
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
        setnpAlbum,
        setTabTitle,
    } = props;
    const [ isHover, setIsHover ] = useState(false);

    const onPlayPauseClick = () => {
        // if there is nothing in the implicit queue and something in the explicit queue play the first track there
        if (!implicitQueuePlaylist && !inExplicitQueue && explicitQueue.length > 0) {
            let newExplicitQueue = [...explicitQueue];
            const [ nextnpTrack, nextnpAlbum ] = newExplicitQueue.pop();
            setExplicitQueue(newExplicitQueue);
            setInExplicitQueue(true);
    
            setNewTrack(true);
            setnpTrack(nextnpTrack);
            setnpAlbum(nextnpAlbum);
            setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        } else if (implicitQueuePlaylist || explicitQueue.length > 0) {
            // dont do anything if there's nothing in the queue
            setIsPlaying(!isPlaying);
        }
    };

    const onEnterEnableHover = () => setIsHover(true);
    const onLeaveDisableHover = () => setIsHover(false);

    return (
        <button 
            onClick={onPlayPauseClick}
            onMouseEnter={onEnterEnableHover}
            onMouseLeave={onLeaveDisableHover}
            style={{color: `${isHover ? "var(--select-color)" : "var(--highlight-color)"}`}}
            className="select-none font-mono font-medium transition duration-300">
            {isPlaying ? `⏸${String.fromCodePoint(0xFE0E)}` : `▶${String.fromCodePoint(0xFE0E)}`}
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
        setnpAlbum,
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
        let nextnpAlbum = null;

        // consume explicit queue first
        if (explicitQueue.length > 0) {
            let newExplicitQueue = [...explicitQueue];
            [ nextnpTrack, nextnpAlbum ] = newExplicitQueue.pop();
            
            setExplicitQueue(newExplicitQueue);
            setInExplicitQueue(true);
        } else {
            setInExplicitQueue(false);
            const [ newDiscIndex, newTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
            if (newDiscIndex !== implicitQueueDiscIndex || newTrackIndex !== implicitQueueTrackIndex) {
                nextnpTrack = implicitQueuePlaylist.discs[newDiscIndex].tracks[newTrackIndex];
                nextnpAlbum = implicitQueuePlaylist;
                setImplicitQueueDiscIndex(newDiscIndex);
                setImplicitQueueTrackIndex(newTrackIndex);
            }
        }

        if (nextnpTrack) {
            setNewTrack(true);
            setnpTrack(nextnpTrack);
            setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);

            if (nextnpAlbum) {
                setnpAlbum(nextnpAlbum);
            }
        }
    };

    return (
        <div onClick={onClickNextTrack}
            className={`select-none transition duration-300 ${isLastTrack ? "text-gray-600 hover:cursor-default" : "text-slate-50 hover:cursor-pointer hover:text-amber-500"}`}>
            ⏭&#xFE0E;
        </div>
    );
}

export {
    ControlButtons,
    PlayPauseButton,
}