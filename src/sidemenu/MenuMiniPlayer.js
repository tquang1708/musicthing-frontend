import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PlayPauseButton from './controls/PlayPauseButton';

function MenuMiniPlayer(props) {
    const {
        artSource,
        npArtist,
        npAlbum,
        npTitle,
        showSidebar,
        setShowSidebar,
        isPlaying,
        setIsPlaying,
        setDivHeight,
    } = props;

    return (
        <div className="flex flex-row">
            <MenuCornerImage 
                artSource={artSource}
                npArtist={npArtist}
                npAlbum={npAlbum}
                npTitle={npTitle}
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                setDivHeight={setDivHeight}
            />
            <MenuMiniControls 
                npArtist={npArtist}
                npAlbum={npAlbum}
                npTitle={npTitle}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />
        </div>
    );
}

function MenuCornerImage(props) {
    const {
        artSource,
        npArtist,
        npAlbum,
        npTitle,
        showSidebar,
        setShowSidebar,
        setDivHeight,
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
    }, [showSidebar]);

    return (
        <div onMouseEnter={onEnterShowButton} onMouseLeave={onLeaveHideButton}
            className="bg-gray-700 overflow-hidden z-40 w-14 h-14 2xl:w-20 2xl:h-20 hover:cursor-pointer">
            <div onClick={onClickToggleSidebar} 
                className={`absolute flex justify-center items-center font-mono text-slate-50 drop-shadow z-10 transition ease-in-out duration-200 text-7xl w-14 h-14 2xl:text-9xl 2xl:w-20 2xl:h-20 ${!showButton && "opacity-0"}`}>
                ☰
            </div>
            <img 
                src={artSource} 
                alt={`Front cover art for ${npTitle} by ${npArtist} from the album ${npAlbum ? npAlbum.title : "Unknown Album"}`} 
                className={`object-contain w-14 h-14 2xl:w-20 2xl:h-20 transition ease-in-out duration-200 ${showButton && "blur-md"}`} >
            </img>
        </div>
    )
}

function MenuMiniControls(props) {
    const {
        npArtist,
        npAlbum,
        npTitle,
        isPlaying,
        setIsPlaying,
    } = props;

    return(
        <div className="flex flex-col bg-gray-700 z-40 w-42 h-14 pl-1 gap-y-0.5 2xl:w-60 2xl:h-20 2xl:pl-2 2xl:gap-y-2">
            <div className="font-sans font-bold text-slate-50 truncate text-xl pt-0.5 2xl:text-3xl 2xl:pt-1">
                {npTitle}
            </div>
            <div className="flex flex-row font-sans font-sem text-slate-50 truncate text-base 2xl:text-xl">
                <div>
                    {npArtist} -&nbsp;
                </div>
                <Link to={npAlbum ? `/album/${npAlbum.id}` : "/album"} className="hover:underline hover:decoration-solid">{npAlbum ? npAlbum.name : "Unknown Album"}</Link>
            </div>
            <div className="grid grid-cols-3 justify-center grow">
                <p></p>
                <PlayPauseButton 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying} />
                <VolumeButton />
            </div>
        </div>
    );
}

function VolumeButton() {
    return (
        <button
            className="justify-self-end pr-3 font-mono font-medium text-3xl text-slate-50 hover:text-amber-500 transition duration-300">
            ?{/* 🕪 */}
        </button>
    );
}

export default MenuMiniPlayer;