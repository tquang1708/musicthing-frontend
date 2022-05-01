import React from 'react';
import { PlayPauseButton } from './controls/ControlButtons';

import unwrapMetadata from '../misc/helper/unwrapMetadata';

function BottomMenuMobile(props) {
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
    } = props;

    const {
        artSource,
        title,
        artist,
        album,
    } = unwrapMetadata(serverUrl, npTrack, npAlbum);

    return (
        <div className="fixed flex flex-row justify-center h-10 w-screen bottom-0 z-10">
            <img 
                src={artSource} 
                alt={`Front cover art for ${title} by ${artist} from the album ${album}`} 
                className={`bg-gray-700 object-contain w-10 h-10`} >
            </img>
            <div className="flex flex-col grow min-w-0 bg-gray-700">
                <div className="font-sans font-bold text-xl pl-1 pt-1 text-slate-50 truncate">
                    {title}
                </div>
                <div className="font-sans font-sem text-base pl-1 pt-1 pb-1 text-slate-50 truncate">
                    {artist} - {album}
                </div>
            </div>
            <div className="flex items-center justify-center text-4xl basis-14 bg-gray-700">
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
        </div>
    );
}

export default BottomMenuMobile;