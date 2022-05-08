import React from "react";
import { PlayPauseButton } from '../controls/ControlButtons';
import unwrapMetadata from '../../misc/helper/unwrapMetadata';
import tabIcons from "../tabs/tabIcons";

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
            className={`bg-gray-700 overflow-hidden object-contain basis-10 h-10 shrink-0 hover:cursor-pointer`}>
            <div
                style={{
                    WebkitTextStroke: "2px var(--highlight-color)",
                    color: "var(--menu-text-icon-color)",
                }}
                className={`absolute text-center flex flex-col justify-center select-none drop-shadow z-10 text-7xl w-10 h-10 ${!bottomMenuContentVisible && "hidden"}`}>
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
            className="flex flex-col grow min-w-0 bg-gray-700 hover:cursor-pointer">
            <div 
                style={{color: "var(--highlight-color)"}}
                className="font-sans font-bold text-base pl-1 pt-1 truncate">
                {title}
            </div>
            <div 
                style={{color: "var(--highlight-color)"}}
                className="font-sans font-sem text-lg pl-1 pt-1 pb-1 truncate">
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
        if (i !== tabIcons.length - 1) {
            setShowSettingMessage(false);
        }
    };

    const images = tabIcons.map((tab, i) => {
        return (
            <div
                key={`tab image ${tab[0]}`} 
                onClick={() => onClickSetTab(i)}
                className={`p-1 w-10 h-10
                    ${i === tabIcons.length - 1 && "ml-auto"} 
                    ${i !== selectedTab ? "bg-gray-700" : "bg-gray-500"} 
                    transition duration-350 ease-in-out hover:cursor-pointer hover:bg-amber-700`}>
                {tab[1]}
            </div>
        )
    });

    return (
        <div className="flex flex-row overflow-auto grow min-w-0 bg-gray-700">
            {images}
        </div>
    );
}

export default MenuContentTabMiniPlayerMobile;