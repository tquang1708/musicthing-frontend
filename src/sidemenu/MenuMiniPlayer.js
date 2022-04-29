import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ControlButtons } from './controls/ControlButtons';

import unwrapMetadata from '../misc/helper/unwrapMetadata';

function MenuMiniPlayer(props) {
    const {
        serverUrl,
        setTabTitle,
        npAlbum,
        npTrack,
        setnpTrack,
        setnpAlbum,
        showSidebar,
        setShowSidebar,
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
        setDivHeight,
        showMenu,
        setDivWidth,
    } = props;

    return (
        <div className="flex flex-row">
            <MenuCornerImage 
                serverUrl={serverUrl}
                npAlbum={npAlbum}
                npTrack={npTrack}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                setDivHeight={setDivHeight}
                showMenu={showMenu}
                setDivWidth={setDivWidth}
            />
            <MenuMiniControls 
                serverUrl={serverUrl}
                setTabTitle={setTabTitle}
                npAlbum={npAlbum}
                npTrack={npTrack}
                setnpTrack={setnpTrack}
                setnpAlbum={setnpAlbum}
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
            />
        </div>
    );
}

function MenuCornerImage(props) {
    const {
        serverUrl,
        npAlbum,
        npTrack,
        showSidebar,
        setShowSidebar,
        setDivHeight,
        showMenu,
        setDivWidth,
    } = props;
    const [ showButton, setShowButton ] = useState(false);

    const onEnterShowButton = () => {
        setShowButton(true);
    };
    const onLeaveHideButton = () => {
        setShowButton(false);
    };
    const onClickToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(() => {
        if (showSidebar) {
            setDivHeight("h-screen");
        }
        if (showMenu) {
            setDivWidth("w-auto");
        }
    }, [showSidebar]);

    const {
        artSource,
        title,
        artist,
        album,
    } = unwrapMetadata(serverUrl, npTrack, npAlbum);

    return (
        <div onMouseEnter={onEnterShowButton} onMouseLeave={onLeaveHideButton}
            className="bg-gray-700 overflow-hidden z-40 w-14 h-14 2xl:w-20 2xl:h-20 hover:cursor-pointer">
            <div onClick={onClickToggleSidebar} 
                className={`absolute flex justify-center items-center select-none font-mono text-black drop-shadow z-10 transition ease-in-out duration-200 text-6xl w-14 h-14 2xl:text-8xl 2xl:w-20 2xl:h-20 ${!showButton && "opacity-0"}`}>
                ☰
            </div>
            <img 
                src={artSource} 
                alt={`Front cover art for ${title} by ${artist} from the album ${album}`} 
                className={`object-contain w-14 h-14 2xl:w-20 2xl:h-20 transition ease-in-out duration-200 ${showButton && "blur-md"}`} >
            </img>
        </div>
    )
}

function MenuMiniControls(props) {
    const {
        serverUrl,
        setTabTitle,
        npAlbum,
        npTrack,
        setnpTrack,
        setnpAlbum,
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
    } = props;

    const {
        title,
        artist,
        album,
    } = unwrapMetadata(serverUrl, npTrack, npAlbum);

    return(
        <div className="flex flex-col bg-gray-700 z-40 w-42 h-14 pl-1 gap-y-0.5 2xl:w-60 2xl:h-20 2xl:pl-2">
            <div className="font-sans font-bold text-slate-50 truncate text-xl pt-0.5 2xl:text-2xl 2xl:pt-1">
                {title}
            </div>
            <div className="font-sans text-slate-50 truncate text-sm 2xl:text-lg">
                    {artist}
            </div>
            <Link to={npAlbum ? `/album/${npAlbum.id}` : "/album"} 
                className="font-sans text-slate-50 truncate text-base 2xl:text-xl hover:underline hover:decoration-solid">
                {album}
            </Link>
            <div className="grid grid-cols-3 justify-center items-center grow font-mono font-medium text-3xl select-none">
                <p></p>
                <ControlButtons
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
                <VolumeButton />
            </div>
        </div>
    );
}

function VolumeButton() {
    return (
        <div
            className="justify-self-end pr-3 transition duration-300 text-slate-50 hover:text-amber-500 hover:cursor-pointer">
            ?{/* 🕪 */}
        </div>
    );
}

export default MenuMiniPlayer;