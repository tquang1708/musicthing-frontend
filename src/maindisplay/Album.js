import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import secondsToTimeString from '../helper/secondsToTimeString';
import unknown_album from '../unknown_album.svg';

function Album(props) {
    const {
        serverUrl,
        backLinkTo,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setIsPlaying,
    } = props;
    const [ album, setAlbum ] = useState(null);
    const [ onBigScreen, setOnBigScreen ] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );

    const { id } = useParams();
    const navigate = useNavigate();

    // detect mobile
    useEffect(() => {
        window
        .matchMedia("(min-width: 768px)")
        .addEventListener('change', e => setOnBigScreen( e.matches ));
    }, []);

    // fetch info
    useEffect(() => {
        fetch(`${serverUrl}/api/list/album/${id}`)
            .then((response) => response.json())
            .then((data) => setAlbum(data))
            .catch((error) => console.log(error));
    }, [id]);

    const onClickGoBack = () => {
        navigate(backLinkTo ? backLinkTo : "/album");
    };

    const display = album ? 
        <AlbumDisplay
            album={album}
            serverUrl={serverUrl}
            onBigScreen={onBigScreen}
            setTabTitle={setTabTitle}
            setArtSource={setArtSource}
            setnpSource={setnpSource}
            setnpArtist={setnpArtist}
            setnpAlbum={setnpAlbum}
            setnpTitle={setnpTitle}
            setIsPlaying={setIsPlaying}
        />
        : 
        <div
            className="p-4 text-slate-50 text-xl font-semibold">
            Invalid ID - Album can&apos;t be displayed
        </div>

    return (
        <div className="flex flex-col">
            {onBigScreen && <div
                onClick={onClickGoBack} 
                className="self-end flex justify-center items-center w-20 h-20 font-mono text-8xl text-slate-50 transition ease-in-out duration-300 hover:cursor-pointer hover:text-amber-300">
                X
            </div>}
            {display}
        </div>
    );
}

function AlbumDisplay(props) {
    const {
        album,
        serverUrl,
        onBigScreen,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setIsPlaying,
    } = props;

    // calculating some information
    const artSource = album.art_path ? `${serverUrl}/art/${album.art_path}` : unknown_album;
    const discsTrackCount = album.discs.map((disc) => {return disc.tracks.length});
    const totalTrackCount = discsTrackCount.reduce((a,b) => a+b, 0);
    const discsTimeCount = album.discs.map((disc) => {
        return disc.tracks.map((t) => t.length_seconds).reduce((prev, curr) => prev + curr, 0);
    });
    const totalSecondsCount = discsTimeCount.reduce((a,b) => a+b, 0);

    return (
        <div className="flex flex-col 2xl:flex-row md:p-4">
            <div className="flex flex-col md:flex-row 2xl:flex-col 2xl:w-80 2xl:sticky 2xl:top-0 2xl:self-start">
                <img 
                    src={artSource} 
                    alt={`Front cover art for album ${album.name} by ${album.album_artist_name}`} 
                    className="bg-gray-700 object-contain drop-shadow-2xl w-full md:w-40 md:h-40 2xl:w-80 2xl:h-80" >
                </img>
                <div className="flex flex-col-reverse pt-3 md:pt-0">
                    <div className="font-sans font-light text-base md:text-xl pl-3 text-slate-50 break-words">
                        {`${totalTrackCount} Tracks - ${secondsToTimeString(totalSecondsCount)}`}
                    </div>
                    <div className="font-sans font-sem text-xl md:text-3xl pl-3 pb-3 text-slate-50 break-words">
                        {album.album_artist_name}
                    </div>
                    <div className="font-sans font-bold text-3xl md:text-5xl pl-3 pb-3 2xl:pt-3 text-slate-50 break-words">
                        {album.name}
                    </div>
                </div>
            </div>
            <TrackListing 
                album={album}
                discsTrackCount={discsTrackCount}
                discsTimeCount={discsTimeCount}
                serverUrl={serverUrl}
                onBigScreen={onBigScreen}
                setTabTitle={setTabTitle}
                setArtSource={setArtSource}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpAlbum={setnpAlbum}
                setnpTitle={setnpTitle}
                setIsPlaying={setIsPlaying}
            />
        </div>

    );
}

function TrackListing(props) {
    const {
        album,
        discsTrackCount,
        discsTimeCount,
        serverUrl,
        onBigScreen,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setIsPlaying,
    } = props;

    // zip relevant information for discs
    const discsInfo = album.discs.map((disc, i) => {
        return [disc, discsTrackCount[i], discsTimeCount[i]];
    });

    // generate discs
    const discs = discsInfo.map((disc) =>
        <div key={`Album ${album.id} Disc ${disc[0].number}`}
            className="md:pt-2">
            <Disc 
                disc={disc}
                lengthOne={discsInfo.length === 1}
                album={album}
                serverUrl={serverUrl}
                onBigScreen={onBigScreen}
                setTabTitle={setTabTitle}
                setArtSource={setArtSource}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpAlbum={setnpAlbum}
                setnpTitle={setnpTitle}
                setIsPlaying={setIsPlaying}
            />
        </div>
    );

    return (
        <div className="p-2 grow md:pt-2 md:p-4">
            {discs}
        </div>
    );
}

function Disc(props) {
    const {
        disc,
        lengthOne,
        album,
        serverUrl,
        onBigScreen,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setIsPlaying,
    } = props;

    // generate tracks
    const tracks = disc[0].tracks.map((track) => 
        <div key={`Album ${album.id} Disc ${disc[0].number} Track ${track.number}`}>
            <Track 
                track={track}
                album={album}
                serverUrl={serverUrl}
                onBigScreen={onBigScreen}
                setTabTitle={setTabTitle}
                setArtSource={setArtSource}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpAlbum={setnpAlbum}
                setnpTitle={setnpTitle}
                setIsPlaying={setIsPlaying}
            />
        </div>
    );

    return (
        <div className="flex flex-col">
            {!lengthOne && 
                <div className="flex flex-row text-slate-50 items-baseline">
                    <div className="font-mono text-xl">
                        ⦿
                    </div>
                    <div className="font-sans font-semibold text-2xl">
                        &nbsp;&nbsp;{`Disc ${disc[0].number}`}
                    </div>
                    <div className="font-light">
                        &nbsp;&nbsp;{`${disc[1]} Tracks - ${secondsToTimeString(disc[2])}`}
                    </div>
                </div>
            }
            {tracks}
        </div>
    );
}

function Track(props) {
    const {
        track,
        album,
        serverUrl,
        onBigScreen,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setIsPlaying,
    } = props;
    const [ showPlay, setShowPlay ] = useState(false);

    const onEnterShowPlay = () => {
        setShowPlay(true);
    };
    const onLeaveHidePlay = () => {
        setShowPlay(false);
    };
    
    // get art source
    let artSource;
    if (track.art_path) {
        artSource = `${serverUrl}/art/${track.art_path}`;
    } else if (album.art_path) {
        artSource = `${serverUrl}/art/${album.art_path}`;
    } else {
        artSource = unknown_album;
    }

    const onClickPlayTrack = () => {
        setTabTitle(`${track.artist} - ${track.name} | musicthing`);
        setArtSource(artSource);
        setnpSource(`${serverUrl}/track/${track.path}`);
        setnpArtist(track.artist);
        setnpAlbum(album);
        setnpTitle(track.name);
        setIsPlaying(true);
    };

    const playButton = <div className="font-mono text-3xl md:text-4xl hover:cursor-pointer" onClick={onClickPlayTrack}>▶</div>;

    return (
        <div className="flex flex-row max-w-screen text-slate-50 items-center">
            {!onBigScreen && playButton}
            <div className="flex flex-row grow min-w-0 items-center justify-items-center ml-2 md:ml-4 my-1 h-8 rounded-lg drop-shadow-md bg-gray-500 transition ease-linear duration-200 hover:bg-gray-300 hover:text-slate-700"
                onMouseEnter={onEnterShowPlay} onMouseLeave={onLeaveHidePlay}>
                <div className="font-sans text-sm md:text-2xl font-semibold px-2">
                    {track.number}
                </div>
                <div className="font-sans text-base md:text-2xl max-h-8 font-semibold overflow-hidden text-ellipsis">
                    {`${track.artist}`}
                </div>
                <div className="font-sans text-lg md:text-3xl max-h-8 font-light px-2 overflow-hidden text-ellipsis">
                    {track.name}
                </div>
                <div className="ml-auto px-2">
                    {onBigScreen && showPlay ? 
                        <div className="font-mono text-4xl hover:cursor-pointer" onClick={onClickPlayTrack}>▶</div> : 
                        <div>{secondsToTimeString(track.length_seconds)}</div>}
                </div>
            </div>
        </div>
    );
}

export default Album;