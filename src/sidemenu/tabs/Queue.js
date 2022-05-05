import React, { useState } from "react";
import { HashLink } from 'react-router-hash-link';
import { incrementQueueIndex } from '../../misc/helper/queueIndex';
import secondsToTimeString from "../../misc/helper/secondsToTimeString";

import unknown_album from "../../unknown_album.svg";

export default function Queue(props) {
    const {
        serverUrl,
        onBigScreen,
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
        setnpTrack,
        setnpAlbum,
        setTabTitle,
        setBottomMenuContentVisible,
    } = props;

    const onClickSkipToImplicitQueueTrack = (i, j) => {
        const nextnpTrack = implicitQueuePlaylist.discs[i].tracks[j];
        setNewTrack(true);
        setnpTrack(nextnpTrack);
        setnpAlbum(implicitQueuePlaylist);
        setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        setInExplicitQueue(true);

        // skipping to an implicit queue track means skipping past the explicit queue too
        setExplicitQueue([]);
        setInExplicitQueue(false);
        setImplicitQueueDiscIndex(i);
        setImplicitQueueTrackIndex(j);
    }

    let implicitQueueItems;
    if (implicitQueuePlaylist) {
        const discs = implicitQueuePlaylist.discs;
        const lengthOne = discs.length === 1;

        implicitQueueItems = discs.map((disc, i) => {
            if (i >= implicitQueueDiscIndex) {
                // current disc with track
                return (
                    <div key={`implicit queue item ${implicitQueuePlaylist.id} Disc ${disc.number} ${i}`}>
                        {!lengthOne && (i > implicitQueueDiscIndex || (i === implicitQueueDiscIndex) && (implicitQueueTrackIndex !== disc.tracks.length - 1)) &&
                            <div className="px-0.5 pb-[2px] font-semibold">
                                {`⦿ Disc ${disc.number}`}
                            </div>
                        }
                        {disc.tracks.map(((track, j) => {
                            if ((i === implicitQueueDiscIndex && j > implicitQueueTrackIndex) || i > implicitQueueDiscIndex) {
                                return (
                                    <QueueItem
                                        key={`implicit queue item ${track.id} ${j}`} 
                                        serverUrl={serverUrl}
                                        track={track}
                                        onClickSkipFunc={() => onClickSkipToImplicitQueueTrack(i, j)}
                                        setBottomMenuContentVisible={setBottomMenuContentVisible}
                                    />);
                            }
                        }))}
                    </div>
                );
            }
        });
    } else {
        implicitQueueItems = [];
    }

    const onClickSkipToExplicitQueueTrack = (index) => {
        const [ nextnpTrack, nextnpAlbum ] = explicitQueue[index];
        setNewTrack(true);
        setnpTrack(nextnpTrack);
        setnpAlbum(nextnpAlbum);
        setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        setInExplicitQueue(true);

        setExplicitQueue((explicitQueue) => {
            return explicitQueue.filter((v, i) => i < index);
        });
    }
    const onClickRemoveFromExplicitQueue = (index) => {
        setExplicitQueue((explicitQueue) => {
            return explicitQueue.filter((v, i) => i !== index);
        });
    };
    const onClickClearExplicitQueue = () => setExplicitQueue([]);

    // scroll with offset func
    const scrollWithOffset = (e) => {
        const yCoords = e.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: yCoords, behavior: "smooth"})
    }

    // explicit queue is reversed
    const explicitQueueLength = explicitQueue.length;
    const explicitQueueItems = explicitQueue.map((item, i) => {
        const [ track, album ] = item;
        return (
            <QueueItem
                key={`explicit queue item ${track.id} ${i}`} 
                onBigScreen={onBigScreen}
                serverUrl={serverUrl}
                explicitQueue={explicitQueue}
                index={explicitQueueLength - i}
                track={track}
                album={album}
                scrollWithOffset={scrollWithOffset}
                onClickSkipFunc={() => onClickSkipToExplicitQueueTrack(i)}
                onClickRemoveFunc={() => onClickRemoveFromExplicitQueue(i)}
                setBottomMenuContentVisible={setBottomMenuContentVisible}
            />
        );
    }).reverse();

    // hide mobile menu on redirect
    const onClickHideMobileMenu = () => setBottomMenuContentVisible(false);

    let display;
    if (implicitQueueItems.length === 0 && explicitQueueItems.length === 0) {
        // nothing in either queue
        display = <div className="m-2 select-none text-base 2xl:text-lg font-semibold text-slate-50">Queue is Empty. Add something to get started!</div>;
    } else {
        // calculate next index for implicit queue
        const [ nextDiscIndex, nextTrackIndex ] = incrementQueueIndex(implicitQueuePlaylist, implicitQueueDiscIndex, implicitQueueTrackIndex);
        display =
            <div className="w-screen md:w-auto">
                {explicitQueue.length > 0 && 
                    <div className="flex flex-row justify-between px-0.5 pb-[2px]">
                        <div>
                            Current Queue
                        </div>
                        <div
                            onClick={onClickClearExplicitQueue} 
                            className="select-none hover:cursor-pointer hover:underline">
                            Clear All
                        </div>
                    </div>}
                {explicitQueueItems}
                {implicitQueuePlaylist && (inExplicitQueue || explicitQueueLength > 0) && 
                    <div className="flex flex-row flex-nowrap justify-start px-0.5 pb-[2px]">
                        <div className="shrink-0">
                            Continue From&nbsp;
                        </div>
                        <HashLink to={implicitQueuePlaylist ? `/album/${implicitQueuePlaylist.id}#${implicitQueuePlaylist.discs[nextDiscIndex].tracks[nextTrackIndex].id}` : `/`}
                            smooth
                            scroll={scrollWithOffset}
                            onClick={onClickHideMobileMenu}
                            className="font-sans truncate font-semibold hover:underline hover:decoration-solid">
                            {implicitQueuePlaylist ? implicitQueuePlaylist.name : ""}
                        </HashLink>
                    </div>
                }
                {implicitQueueItems}
            </div>
    }

    return (
        <div className="flex flex-col bg-gray-500">
            <div className="h-8 md:hidden"></div>
            {display}
        </div>
    );
}

function QueueItem(props) {
    const {
        serverUrl,
        onBigScreen,
        explicitQueue,
        track,
        album,
        index,
        scrollWithOffset,
        onClickSkipFunc,
        onClickRemoveFunc,
        setBottomMenuContentVisible,
    } = props;
    const [ showButton, setShowButton ] = useState(false);
    const [ changeBackground, setChangeBackground ] = useState(false);
    const [ changeBackgroundRemove, setChangeBackgroundRemove ] = useState(false);

    const onEnterShowButton = () => setShowButton(true);
    const onLeaveHideButton = () => setShowButton(false);
    const onEnterChangeBackground = () => setChangeBackground(true);
    const onLeaveRestoreBackground = () => setChangeBackground(false);
    const onEnterChangeBackgroundRemove = () => setChangeBackgroundRemove(true);
    const onLeaveRestoreBackgroundRemove = () => setChangeBackgroundRemove(false);

    const rightButton = onClickRemoveFunc ? 
        <div onClick={onClickRemoveFunc} onMouseEnter={onEnterChangeBackgroundRemove} onMouseLeave={onLeaveRestoreBackgroundRemove}
            className={`ml-auto select-none ${(!onBigScreen || showButton) ? "text-5xl" : "text-normal"} hover:cursor-pointer hover:text-gray-700`}>
            {(!onBigScreen || showButton) ? "-" : secondsToTimeString(track.length_seconds)}
        </div> :
        <div className="ml-auto">
            {secondsToTimeString(track.length_seconds)}
        </div>

    const onClickHideMobileMenu = () => setBottomMenuContentVisible(false);

    return (                       
        <div onMouseEnter={onEnterShowButton} onMouseLeave={onLeaveHideButton}
            className={`flex flex-row items-center gap-1.5 px-1 py-[2px] transition duration-200 ease-in-out text-black hover:text-slate-50 ${changeBackground ? "bg-amber-700" : (changeBackgroundRemove ? "bg-red-500" : "bg-gray-500 hover:bg-gray-700")}`}>
            <div onClick={onClickSkipFunc} onMouseEnter={onEnterChangeBackground} onMouseLeave={onLeaveRestoreBackground}
                className={`w-3 select-none ${showButton ? "text-xl" : "text-lg"} shrink-0 hover:text-gray-700 hover:cursor-pointer`}>
                {(!onBigScreen || showButton) ? `▶${String.fromCodePoint(0xFE0E)}` : (index ? index : track.number)}
            </div>
            <img 
                alt={`Cover image of track ${track.name} from the implicit queue`} 
                src={track.art_path ? `${serverUrl}/api/art/${track.art_path}` : unknown_album}
                className={`w-8 h-8 object-contain shrink-0 transition duration-200 ease-in-out ${showButton ? (changeBackground ? "bg-amber-700" : (changeBackgroundRemove ? "bg-red-500" : "bg-gray-700")) : "bg-gray-500"}`}>    
            </img>
            <div className="flex flex-col shrink min-w-0 whitespace-nowrap">
                <div className="font-bold overflow-hidden text-ellipsis">
                    {track.name}
                </div>
                <div className={`font-light overflow-hidden text-ellipsis ${album ? "text-sm" : "text-base"}`}>
                    {track.artist}
                </div>
                {album && 
                    <HashLink to={album ? `/album/${album.id}${explicitQueue ? `#${explicitQueue[explicitQueue.length - index][0].id}` : ""}` : `/`}
                        smooth
                        scroll={scrollWithOffset}
                        onClick={onClickHideMobileMenu}
                        className="overflow-hidden text-ellipsis text-sm font-medium hover:underline hover:decoration-solid">
                        {album.name}
                    </HashLink>}
            </div>
            {rightButton}
        </div>
    );
}
