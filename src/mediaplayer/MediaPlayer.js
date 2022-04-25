import React, { useState, useEffect, useRef } from 'react';

// alot referred from this article
// https://letsbuildui.dev/articles/building-an-audio-player-with-react-hooks
function MediaPlayer(props) {
    const { 
        artSource,
        npSource,
        npArtist,
        npAlbum,
        npTitle,
        isPlaying,
        setIsPlaying,
    } = props;
    const [ showPlayer, setShowPlayer ] = useState(true);
    const [ onBigScreen, setOnBigScreen ] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );

    // audio source
    const audioRef = useRef(new Audio(npSource));

    // handle source change
    useEffect(() => {
        audioRef.current.pause();
        audioRef.current = new Audio(npSource);
        audioRef.current.play();
    }, [npSource]);

    // handle isPlaying change
    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    // detect mobile
    // from https://stackoverflow.com/questions/54491645/media-query-syntax-for-reactjs
    useEffect(() => {
        window
        .matchMedia("(min-width: 768px)")
        .addEventListener('change', e => setOnBigScreen( e.matches ));
    }, []);

    return (
        <div>
            {onBigScreen && 
                <BigScreenPlayer 
                    npArtist={npArtist}
                    npAlbum={npAlbum}
                    npTitle={npTitle}
                    artSource={artSource}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    showPlayer={showPlayer}
                    setShowPlayer={setShowPlayer}
                />}
            {!onBigScreen && 
                <MobilePlayer 
                    npArtist={npArtist}
                    npAlbum={npAlbum}
                    npTitle={npTitle}
                    artSource={artSource}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />}
        </div>
    );
}

function BigScreenPlayer(props) {
    const {
        npArtist,
        npAlbum,
        npTitle,
        artSource,
        isPlaying,
        setIsPlaying,
        showPlayer,
        setShowPlayer,
    } = props;

    return (
        <div className="fixed flex flex-row h-20 top-0">
            <div className={`flex transition ease-in-out duration-500 ${showPlayer ? "translate-x-0" : "-translate-x-full"}`}>
                <TrackImage 
                    npArtist={npArtist}
                    npAlbum={npAlbum}
                    npTitle={npTitle}
                    artSource={artSource} />
                <Controls 
                    npArtist={npArtist}
                    npAlbum={npAlbum}
                    npTitle={npTitle}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying} />
            </div>
            <PlayerHideButton 
                showPlayer={showPlayer}
                setShowPlayer={setShowPlayer} />
        </div>
    );
}

function MobilePlayer(props) {
    const {
        npArtist,
        npAlbum,
        npTitle,
        artSource,
        isPlaying,
        setIsPlaying,
    } = props;

    return (
        <div className="fixed flex flex-row h-8 bottom-0">
            <TrackImage 
                npArtist={npArtist}
                npAlbum={npAlbum}
                npTitle={npTitle}
                artSource={artSource} />
            <div className="flex flex-col w-20 bg-gray-700">
                <div className="font-sans font-bold text-base pl-1 pt-1.5 text-slate-50 truncate">
                    {npTitle}
                </div>
                <div className="font-sans font-sem text-xs pl-1 pt-1.5 text-slate-50 truncate">
                    {npArtist} - {npAlbum}
                </div>
            </div>
            <div className="flex flex-col justify-center w-6 bg-gray-700">
                <PlayPauseButton 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying} />
            </div>
        </div>
    );
}

function TrackImage(props) {
    const {
        artSource,
        npArtist,
        npAlbum,
        npTitle,
    } = props;

    return (
        <img 
            src={artSource} 
            alt={`Front cover art for ${npTitle} by ${npArtist} from the album ${npAlbum}`} 
            className="bg-gray-700 object-contain w-8 md:w-20" >
        </img>
    );
}

function PlayerHideButton(props) {
    const {
        showPlayer,
        setShowPlayer,
    } = props;

    const onClickTogglePlayer = () => {
        setShowPlayer(!showPlayer);
    };

    return (
        <div 
            onClick={onClickTogglePlayer}
            className={`flex flex-col justify-center px-1 bg-gray-700 font-mono text-2xl text-slate-50 hover:cursor-pointer hover:text-amber-300 hover:bg-gray-800 ease-in-out duration-500 ${showPlayer ? "translate-x-0 opacity-100" : "-translate-x-80 opacity-90"}`}>
            {showPlayer ? "◀︎" : "▶︎"}
        </div>
    );
}

function Controls(props) {
    const {
        npArtist,
        npAlbum,
        npTitle,
        isPlaying,
        setIsPlaying,
    } = props;

    return (
        <div className="flex flex-col bg-gray-700 opacity-90 w-60">
            <div className="font-sans font-bold text-3xl pl-3 pt-3 text-slate-50 truncate">
                {npTitle}
            </div>
            <div className="font-sans font-sem text-xl pl-3 pt-3 text-slate-50 truncate">
                {npArtist} - {npAlbum}
            </div>
            <div className="grid grid-cols-3 justify-center grow">
                <p></p>
                <PlayPauseButton 
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying} />
                <VolumeButton />
            </div>
        </div>
    )
}

function PlayPauseButton(props) {
    const {
        isPlaying,
        setIsPlaying,
    } = props;

    const onPlayPauseClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <button 
            onClick={onPlayPauseClick}
            className="font-mono font-medium text-3xl text-slate-50 md:hover:text-amber-500 transition duration-300">
            {isPlaying ? "⏸" : "▶"}
        </button>
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

export default MediaPlayer;