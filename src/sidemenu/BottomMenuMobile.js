import React from 'react';
import { PlayPauseButton } from './controls/ControlButtons';

function BottomMenuMobile(props) {
    const {
        npArtist,
        npAlbum,
        npTitle,
        artSource,
        isPlaying,
        setIsPlaying,
    } = props;

    return (
        <div className="fixed flex flex-row justify-center h-10 w-screen bottom-0 z-10">
            <img 
                src={artSource} 
                alt={`Front cover art for ${npTitle} by ${npArtist} from the album ${npAlbum ? npAlbum.title : "Unknown Album"}`} 
                className={`bg-gray-700 object-contain w-10 h-10`} >
            </img>
            <div className="flex flex-col grow bg-gray-700">
                <div className="font-sans font-bold text-xl pl-1 pt-1 text-slate-50 truncate">
                    {npTitle}
                </div>
                <div className="font-sans font-sem text-base pl-1 pt-1 pb-1 text-slate-50 truncate">
                    {npArtist} - {npAlbum ? npAlbum.name : "Unknown Album"}
                </div>
            </div>
            <div className="flex items-center justify-center w-10 bg-gray-700">
                <PlayPauseButton 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying} />
            </div>
        </div>
    );
}

export default BottomMenuMobile;