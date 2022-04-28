import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import secondsToTimeString from '../helper/secondsToTimeString';
import unknown_album from '../unknown_album.svg';

function Album(props) {
    const {
        serverUrl,
        backLinkTo,
        onBigScreen,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setSidebarOverlay,
        setNewAudio,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ album, setAlbum ] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    // allow sidebar to overlay
    useEffect(() => {
        setSidebarOverlay(true);
    }, []);

    // fetch info
    useEffect(() => {
        fetch(`${serverUrl}/api/list/album/${id}`)
            .then((response) => response.json())
            .then((data) => setAlbum(data))
            .catch((error) => console.log(error));
        window.scroll(0,0);
    }, [id]);

    const onClickGoBack = () => {
        navigate(backLinkTo ? backLinkTo : `/album1234`);
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
            setNewAudio={setNewAudio}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            setImplicitQueuePlaylist={setImplicitQueuePlaylist}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />
        : 
        <div
            className="p-4 text-slate-50 text-3xl 2xl:text-5xl font-semibold self-end">
            Album can&apos;t be displayed. Currently fetching album&apos;s content, or the ID is Invalid.
        </div>

    return (
        <div className="flex flex-col">
            {onBigScreen && <div
                onClick={onClickGoBack} 
                className="self-end flex justify-center items-center w-14 h-14 select-none text-6xl 2xl:w-20 2xl:h-20 2xl:text-8xl font-mono text-slate-50 transition ease-in-out duration-300 hover:cursor-pointer hover:text-amber-500">
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
        setNewAudio,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;

    // calculating some information
    const artSource = album.art_path ? `${serverUrl}/api/art/${album.art_path}` : unknown_album;
    const discsTrackCount = album.discs.map((disc) => {return disc.tracks.length});
    const totalTrackCount = discsTrackCount.reduce((a,b) => a+b, 0);
    const discsTimeCount = album.discs.map((disc) => {
        return disc.tracks.map((t) => t.length_seconds).reduce((prev, curr) => prev + curr, 0);
    });
    const totalSecondsCount = discsTimeCount.reduce((a,b) => a+b, 0);

    const onClickPlayAlbum = () => {
        // first track
        const track = album.discs[0].tracks[0];

        setTabTitle(`${track.artist} - ${track.name} | musicthing`);
        setArtSource(artSource);
        setnpSource(`${serverUrl}/api/track/${track.path}`);
        setnpArtist(track.artist);
        setnpAlbum(album);
        setnpTitle(track.name);
        setNewAudio(true);

        setImplicitQueuePlaylist(album);
        setImplicitQueueDiscIndex(0);
        setImplicitQueueTrackIndex(0);
    };

    return (
        <div className="flex flex-col 2xl:flex-row md:p-6">
            <div className="flex flex-col md:flex-row 2xl:flex-col 2xl:w-81 2xl:min-w-81 2xl:sticky 2xl:top-0 2xl:self-start">
                <img 
                    src={artSource} 
                    alt={`Front cover art for album ${album.name} by ${album.album_artist_name}`} 
                    className="bg-gray-700 object-contain md:w-40 md:h-40 2xl:w-81 2xl:h-81" >
                </img>
                <div className="flex flex-col-reverse pt-3 grow md:pt-0">
                    <div className="flex flex-row items-center font-sans font-light text-base md:text-xl pl-3 2xl:pl-0 text-slate-50 break-words">
                        <div onClick={onClickPlayAlbum} 
                            className="font-mono select-none text-3xl md:transition md:duration-300 hover:md:text-amber-500 hover:cursor-pointer">
                            ▶
                        </div>
                        <div>
                            &nbsp;{`${totalTrackCount} Tracks - ${secondsToTimeString(totalSecondsCount)}`}
                        </div>
                    </div>
                    <div className="font-sans font-sem text-xl md:text-3xl pl-3 2xl:pl-0 pb-1 md:pb-3 text-slate-50 break-words">
                        {album.album_artist_name}
                    </div>
                    <div className="flex flex-row font-sans font-bold text-3xl md:text-5xl pl-3 2xl:pl-0 pb-1 md:pb-3 2xl:pt-3 text-slate-50 break-words">
                        {/* {album.name} */}
                        <div className="grow">
                            {album.name}
                        </div>
                        <div className="font-mono select-none transition duration-300 pt-1 pr-3 2xl:pr-0 md:hidden 2xl:block 2xl:hover:text-amber-500 hover:cursor-pointer">
                            ⋮
                        </div>
                    </div>
                    <div className="font-mono font-bold text-5xl text-slate-50 grow hidden md:block 2xl:hidden self-end select-none transition duration-300 hover:text-amber-500 hover:cursor-pointer">
                        ⋮
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
                setNewAudio={setNewAudio}
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                setImplicitQueuePlaylist={setImplicitQueuePlaylist}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
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
        setNewAudio,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;

    // zip relevant information for discs
    const discsInfo = album.discs.map((disc, i) => {
        return {
            "disc": disc,
            "index": i,
            "trackCount": discsTrackCount[i],
            "lengthSecondsCount": discsTimeCount[i],
        };
    });

    // generate discs
    const discs = discsInfo.map((disc) =>
        <div key={`Album ${album.id} Disc ${disc.index}`}
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
                setNewAudio={setNewAudio}
                explicitQueue={explicitQueue}
                setExplicitQueue={setExplicitQueue}
                setImplicitQueuePlaylist={setImplicitQueuePlaylist}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
            />
        </div>
    );

    return (
        <div className="p-2 grow min-w-0 md:pt-2 md:p-4">
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
        setNewAudio,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ showPlayButton, setShowPlayButton ] = useState(false);

    // generate tracks
    let discContent = disc.disc;
    let discIndex = disc.index;
    const tracks = discContent.tracks.map((track, i) => 
        <Track 
            key={`Album ${album.id} Disc ${discContent.number} Track ${track.path}`}
            track={track}
            album={album}
            discIndex={discIndex}
            trackIndex={i}
            serverUrl={serverUrl}
            onBigScreen={onBigScreen}
            setTabTitle={setTabTitle}
            setArtSource={setArtSource}
            setnpSource={setnpSource}
            setnpArtist={setnpArtist}
            setnpAlbum={setnpAlbum}
            setnpTitle={setnpTitle}
            setNewAudio={setNewAudio}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            setImplicitQueuePlaylist={setImplicitQueuePlaylist}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />
    );


    const onEnterShowPlay = () => setShowPlayButton(true);
    const onLeaveHidePlay = () => setShowPlayButton(false);
    const artSource = album.art_path ? `${serverUrl}/api/art/${album.art_path}` : unknown_album;
    const onClickPlayDisc = () => {
        // first track
        const track = album.discs[discIndex].tracks[0];

        setTabTitle(`${track.artist} - ${track.name} | musicthing`);
        setArtSource(artSource);
        setnpSource(`${serverUrl}/api/track/${track.path}`);
        setnpArtist(track.artist);
        setnpAlbum(album);
        setnpTitle(track.name);
        setNewAudio(true);

        setImplicitQueuePlaylist(album);
        setImplicitQueueDiscIndex(0);
        setImplicitQueueTrackIndex(0);
    }

    return (
        <div className="flex flex-col">
            {!lengthOne && 
                <div className="flex flex-row text-slate-50 items-end">
                    <div onClick={onClickPlayDisc} onMouseEnter={onEnterShowPlay} onMouseLeave={onLeaveHidePlay}
                        className="font-mono select-none text-2xl w-2.5 md:transition md:duration-300 hover:md:text-amber-500 hover:md:cursor-pointer">
                        {showPlayButton && onBigScreen ? "▶" : "⦿"}
                    </div>
                    <div className="flex flex-row items-baseline">
                        <div onMouseEnter={onEnterShowPlay} onMouseLeave={onLeaveHidePlay} className="font-sans font-medium text-3xl">
                            &nbsp;&nbsp;{`Disc ${discContent.number}`}
                        </div>
                        <div className="font-light text-lg">
                            &nbsp;&nbsp;{`${disc.trackCount} Tracks - ${secondsToTimeString(disc.lengthSecondsCount)}`}
                        </div>
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
        discIndex,
        trackIndex,
        serverUrl,
        onBigScreen,
        setTabTitle,
        setArtSource,
        setnpSource,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setNewAudio,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ showButton, setShowButton ] = useState(false);

    const onEnterShowButton = () => {
        setShowButton(true);
    };
    const onLeaveHideButton = () => {
        setShowButton(false);
    };
    
    // get art source
    const artSource = track.art_path ? `${serverUrl}/api/art/${track.art_path}` : unknown_album;
    const onClickPlayTrack = () => {
        setTabTitle(`${track.artist} - ${track.name} | musicthing`);
        setArtSource(artSource);
        setnpSource(`${serverUrl}/api/track/${track.path}`);
        setnpArtist(track.artist);
        setnpAlbum(album);
        setnpTitle(track.name);
        setNewAudio(true);

        // update queue
        setImplicitQueuePlaylist(album);
        setImplicitQueueDiscIndex(discIndex);
        setImplicitQueueTrackIndex(trackIndex);
    };
    const onClickQueueTrack = () => {
        // update explicit queue
        setExplicitQueue([...explicitQueue, track]);
    }

    const playButton = 
    <div 
        className="font-mono select-none text-3xl hover:md:transition hover:md:duration-300 hover:cursor-pointer hover:md:text-amber-700" 
        onClick={onClickPlayTrack}>
        ▶
    </div>;
    const settingButton = 
    <div 
        className="font-mono select-none text-3xl hover:md:transition hover:md:duration-300 hover:cursor-pointer hover:md:text-amber-700"
        onClick={onClickQueueTrack}>
        …
    </div>;
    let rightButton;
    if (onBigScreen && !showButton) {
        rightButton = <div>{secondsToTimeString(track.length_seconds)}</div>;
    } else {
        rightButton = settingButton;
    }

    return (
        <div className="flex flex-row text-slate-50 items-center">
            {!onBigScreen && playButton}
            <div className="flex flex-row grow min-w-0 overflow-hidden items-center justify-items-center ml-2 md:ml-4 my-1 h-8 rounded-lg drop-shadow-md bg-gray-500 transition ease-linear duration-200 hover:bg-gray-300 hover:text-slate-700"
                onMouseEnter={onEnterShowButton} onMouseLeave={onLeaveHideButton}>
                <div className="flex justify-center font-sans text-sm md:text-2xl font-semibold mx-2 w-2 md:w-3">
                    {onBigScreen && showButton ? 
                            playButton : 
                            <div>{track.number}</div>}
                </div>
                <div className="font-sans text-base md:text-2xl font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                    {track.artist}
                </div>
                <div className="font-sans text-lg md:text-2xl font-light px-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    {track.name}
                </div>
                <div className="ml-auto px-2">
                    {rightButton}
                </div>
            </div>
        </div>
    );
}

export default Album;