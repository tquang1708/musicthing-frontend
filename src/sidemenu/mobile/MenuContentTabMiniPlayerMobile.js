import React from "react";
import { PlayPauseButton } from '../controls/ControlButtons';
import unwrapMetadata from '../../misc/helper/unwrapMetadata';

import tab_images from "../tabs/tabimages/tabImages";

function MenuContentTabMiniPlayerMobile(props) {
    const {
        serverUrl,
        npTrack,
        npAlbum,
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
        bottomMenuContentVisible,
        setBottomMenuContentVisible,
        selectedTab,
        setSelectedTab,
        setShowSettingMessage,
    } = props;

    const {
        artSource,
        title,
        artist,
        album,
    } = unwrapMetadata(serverUrl, npTrack, npAlbum);

    return (
        <div className="flex flex-row justify-center h-10 w-screen">
            <MenuContentTabMobileLeftIcon 
                artSource={artSource}
                title={title}
                artist={artist}
                album={album}
                bottomMenuContentVisible={bottomMenuContentVisible}
                setBottomMenuContentVisible={setBottomMenuContentVisible}
            />
            {!bottomMenuContentVisible && 
                <MenuMiniPlayerMobileDetails 
                    title={title}
                    artist={artist}
                    album={album}
                    bottomMenuContentVisible={bottomMenuContentVisible}
                    setBottomMenuContentVisible={setBottomMenuContentVisible}
                />
            }
            {!bottomMenuContentVisible && 
                <div className="flex items-center justify-center text-4xl basis-8 shrink-0 bg-gray-700">
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
                        setTabTitle={setTabTitle} />
                </div>
            }
            {bottomMenuContentVisible &&
                <MenuContentTabIconsMobile 
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    setShowSettingMessage={setShowSettingMessage}
                />
            }
        </div>
    );
}

function MenuContentTabMobileLeftIcon(props) {
    const {
        artSource,
        title,
        artist,
        album,
        bottomMenuContentVisible,
        setBottomMenuContentVisible,
    } = props;

    const onClickToggleContentVisible = () => setBottomMenuContentVisible(!bottomMenuContentVisible);

    return (
        <div onClick={onClickToggleContentVisible}
            className={`bg-gray-700 overflow-hidden object-contain basis-10 h-10 shrink-0`}>
            <div className={`text-stroke-white absolute text-center flex flex-col justify-center select-none text-black drop-shadow z-10 text-7xl w-10 h-10 ${!bottomMenuContentVisible && "hidden"}`}>
                X
            </div>
            <img 
                src={artSource} 
                alt={`Front cover art for ${title} by ${artist} from the album ${album}`} 
                className={`object-contain w-10 h-10 ${bottomMenuContentVisible && "blur-md"}`} >
            </img>
        </div>
    );
}

function MenuMiniPlayerMobileDetails(props) {
    const {
        title,
        artist,
        album,
        bottomMenuContentVisible,
        setBottomMenuContentVisible,
    } = props;

    const onClickToggleContentVisible = () => setBottomMenuContentVisible(!bottomMenuContentVisible);

    return (
        <div onClick={onClickToggleContentVisible} 
            className="flex flex-col grow min-w-0 bg-gray-700">
            <div className="font-sans font-bold text-xl pl-1 pt-1 text-slate-50 truncate">
                {title}
            </div>
            <div className="font-sans font-sem text-base pl-1 pt-1 pb-1 text-slate-50 truncate">
                {artist} - {album}
            </div>
        </div>
    );
}

function MenuContentTabIconsMobile(props) {
    const {
        selectedTab,
        setSelectedTab,
        setShowSettingMessage,
    } = props;

    const onClickSetTab = (i) => {
        setSelectedTab(i);
        if (i !== tab_images.length - 1) {
            setShowSettingMessage(false);
        }
    };

    const images = tab_images.map((tab, i) => {
        return (
            <img
                key={`tab image ${tab[0]}`} 
                src={tab[1]}
                onClick={() => onClickSetTab(i)}
                className={`p-1 w-10 h-10
                    ${i === tab_images.length - 1 ? "ml-auto" : ""} 
                    ${i !== selectedTab ? "bg-gray-700" : "bg-gray-500"}`}>
            </img>
        )
    });

    return (
        <div className="flex flex-row overflow-auto grow min-w-0 bg-gray-700">
            {images}
        </div>
    );
}

export default MenuContentTabMiniPlayerMobile;