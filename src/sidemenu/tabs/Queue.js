import React, { useState } from "react";
import { Link } from 'react-router-dom';
import secondsToTimeString from "../../misc/helper/secondsToTimeString";

import unknown_album from "../../unknown_album.svg";

export default function Queue(props) {
    const {
        serverUrl,
        explicitQueue,
        setExplicitQueue,
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

        implicitQueueItems = discs.map((disc, i) => {
            if (i >= implicitQueueDiscIndex) {
                // current disc with track
                return disc.tracks.map(((track, j) => {
                    if ((i == implicitQueueDiscIndex && j > implicitQueueTrackIndex) || i > implicitQueueDiscIndex) {
                        return (
                            <QueueItem
                                key={`implicit queue item ${track.id}`} 
                                serverUrl={serverUrl}
                                track={track}
                                onClickSkipFunc={() => onClickSkipToImplicitQueueTrack(i, j)}
                            />);
                    }
                }))
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

    // explicit queue is reversed
    const explicitQueueLength = explicitQueue.length;
    const explicitQueueItems = explicitQueue.map((item, i) => {
        const [ track, album ] = item;
        return (
            <QueueItem
                key={`explicit queue item ${track.id}`} 
                serverUrl={serverUrl}
                index={explicitQueueLength - i}
                track={track}
                album={album}
                onClickSkipFunc={() => onClickSkipToExplicitQueueTrack(i)}
                onClickRemoveFunc={() => onClickRemoveFromExplicitQueue(i)}
            />
        );
        // <div key={`explicit queue ${track.id} ${i}`}
        //     className="flex flex-row justify-left items-center gap-1.5 pl-0.5">
        //     <div
        //         onClick={() => onClickSkipToExplicitQueueTrack(i)}
        //         className="select-none text-xl hover:text-amber-500 hover:cursor-pointer">
        //         ▶
        //     </div>
        //     <div>
        //         {explicitQueueLength - i}. {track.artist} - {track.name} - {album.name} ({secondsToTimeString(track.length_seconds)})
        //     </div>
        //     <div
        //         onClick={() => onClickRemoveFromExplicitQueue(i)}
        //         className="select-none text-5xl ml-auto hover:text-amber-500 hover:cursor-pointer">
        //         -
        //     </div>
        // </div>
    }).reverse();

    return (
        <div className="bg-gray-500">
            <div className="flex flex-row justify-between">
                <div>
                    Explicit Queue
                </div>
                {explicitQueue.length > 0 && <div
                    onClick={onClickClearExplicitQueue} 
                    className="select-none hover:cursor-pointer hover:underline">
                    Clear All
                </div>}
            </div>
            {explicitQueueItems}
            {implicitQueuePlaylist && <div className="flex flex-row flex-nowrap justify-start">
                <div className="shrink-0">
                    Continue From &nbsp;
                </div>
                <Link to={implicitQueuePlaylist ? `/album/${implicitQueuePlaylist.id}` : `/`}
                    className="font-sans truncate hover:underline hover:decoration-solid">
                    {implicitQueuePlaylist ? implicitQueuePlaylist.name : ""}
                </Link>
            </div>}
            {implicitQueueItems}
        </div>
    );
}

function QueueItem(props) {
    const {
        serverUrl,
        track,
        album,
        index,
        onClickSkipFunc,
        onClickRemoveFunc,
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
            className={`ml-auto select-none ${showButton ? "text-5xl" : "text-sm"} hover:cursor-pointer hover:text-gray-700`}>
            {showButton ? "-" : secondsToTimeString(track.length_seconds)}
        </div> :
        <div className="ml-auto">
            {secondsToTimeString(track.length_seconds)}
        </div>

    return (                       
        <div onMouseEnter={onEnterShowButton} onMouseLeave={onLeaveHideButton}
            className={`flex flex-row items-center gap-1.5 px-1 text-slate-50 transition duration-200 ease-in-out ${changeBackground ? "bg-amber-700" : (changeBackgroundRemove ? "bg-red-500" : "bg-gray-700 hover:bg-gray-500")}`}>
            <div onClick={onClickSkipFunc} onMouseEnter={onEnterChangeBackground} onMouseLeave={onLeaveRestoreBackground}
                className={`w-3 select-none ${showButton ? "text-xl" : "text-lg"} shrink-0 hover:text-gray-700 hover:cursor-pointer`}>
                {showButton ? "▶" : (index ? index : track.number)}
            </div>
            <img 
                alt={`Cover image of track ${track.name} from the implicit queue`} 
                src={track.art_path ? `${serverUrl}/api/art/${track.art_path}` : unknown_album}
                className={`w-8 h-8 object-contain shrink-0 transition duration-200 ease-in-out ${changeBackground ? "bg-amber-700" : "bg-gray-500"}`}>    
            </img>
            <div className="flex flex-col shrink min-w-0 whitespace-nowrap">
                <div className="font-bold overflow-hidden text-ellipsis">
                    {track.name}
                </div>
                <div className={`font-light overflow-hidden text-ellipsis ${album ? "text-sm" : "text-base"}`}>
                    {track.artist}
                </div>
                {album && 
                    <Link to={album ? `/album/${album.id}` : `/`}
                        className="overflow-hidden text-ellipsis text-sm font-medium hover:underline hover:decoration-solid">
                        {album.name}
                    </Link>}
            </div>
            {rightButton}
        </div>
    );
}