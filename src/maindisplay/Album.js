import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import SettingsBox from "./SettingsBox";

import secondsToTimeString from '../misc/helper/secondsToTimeString';
import unknown_album from '../unknown_album.svg';

function Album(props) {
    const {
        serverUrl,
        onBigScreen,
        onBiggerScreen,
        showSidebar,
        setShowSidebar,
        hideSidebarOnDisplayMedium,
        hideSidebarOnDisplayLarge,
        setSidebarOverlay,
        setTabTitle,
        setnpAlbum,
        npTrack,
        setnpTrack,
        setNewTrack,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ album, setAlbum ] = useState(null);
    const [ hashLink, setHashLink ] = useState("/album");
    const [ error, setError ] = useState("");

    const { id } = useParams();

    // allow sidebar to overlay
    useEffect(() => {
        setSidebarOverlay(true);

        // hide sidebar on enter
        if (showSidebar) {
            if ((onBiggerScreen && hideSidebarOnDisplayLarge) || (!onBiggerScreen && onBigScreen && hideSidebarOnDisplayMedium)) {
                setShowSidebar(false);
            }
        }
    }, []);

    // fetch info
    useEffect(() => {
        fetch(`${serverUrl}/api/list/album/${id}`)
            .then((response) => response.json())
            .then((data) => setAlbum(data))
            .catch((err) => setError(err.toString()));
        window.scroll(0,0);
    }, [id]);

    // generate hash link when album is available
    useEffect(() => {
        if (album) {
            setHashLink(`/album#${album.id}`);
        }
    }, [album]);

    // scroll with offset from
    // https://github.com/rafgraph/react-router-hash-link/issues/25#issuecomment-536688104
    const scrollWithOffset = (e) => {
        const yCoords = e.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({top: yCoords})
    }

    const display = album ? 
        <AlbumDisplay
            album={album}
            serverUrl={serverUrl}
            onBigScreen={onBigScreen}
            onBiggerScreen={onBiggerScreen}
            setTabTitle={setTabTitle}
            setnpAlbum={setnpAlbum}
            npTrack={npTrack}
            setnpTrack={setnpTrack}
            setNewTrack={setNewTrack}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            setImplicitQueuePlaylist={setImplicitQueuePlaylist}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />
        : 
        <div
            className="p-4 text-slate-50 text-3xl 2xl:text-5xl font-semibold self-end">
            <div>
                {`Album at ID ${id} can't be displayed. Currently fetching album's content, or the ID is Invalid.`}
            </div>
            <br></br>
            <div>
                {error ? `Error: ${error}` : ""}
            </div>
        </div>

    return (
        <div className="flex flex-col">
            <HashLink
                to={hashLink}
                scroll={scrollWithOffset}
                style={{"WebkitTextStroke": "2px black"}}
                className={`${!onBigScreen ? "absolute" : ""} self-end flex justify-center items-center w-14 h-14 select-none text-6xl 2xl:w-20 2xl:h-20 2xl:text-8xl font-mono text-slate-50 transition ease-in-out duration-300 hover:cursor-pointer hover:text-amber-500`}>
                X
            </HashLink>
            {display}
        </div>
    );
}

function AlbumDisplay(props) {
    const {
        album,
        serverUrl,
        onBigScreen,
        onBiggerScreen,
        setTabTitle,
        setnpAlbum,
        npTrack,
        setnpTrack,
        setNewTrack,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ showSettings, setShowSettings ] = useState(false);
    const [ xOffset, setxOffset ] = useState(0);
    const [ yOffset, setyOffset ] = useState(0);

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
        setnpTrack(track);
        setnpAlbum(album);
        setNewTrack(true);

        setImplicitQueuePlaylist(album);
        setImplicitQueueDiscIndex(0);
        setImplicitQueueTrackIndex(0);
    };

    // settings window
    const onClickShowSettings = (e) => {
        setShowSettings(true);
        setxOffset(e.pageX);
        setyOffset(e.pageY);
    }
    const albumForExplicitQueue = album.discs.reduce((init, disc) => {
        return [...init, ...disc.tracks.map((t) => {return [ t, album ];})];
    }, []).reverse();
    const onClickQueueAlbumTop = () => {
        setExplicitQueue([...explicitQueue, ...albumForExplicitQueue]);
    }
    const onClickQueueAlbum = () => {
        setExplicitQueue([...albumForExplicitQueue, ...explicitQueue]);
    }
    const settingsButtonsContent = [
        ["Play Now", onClickPlayAlbum],
        ["Play Next", onClickQueueAlbumTop],
        ["Add to Queue", onClickQueueAlbum],
    ];

    return (
        <div className="flex flex-col 2xl:flex-row md:p-6">
            <div className="flex flex-col md:flex-row 2xl:flex-col 2xl:w-81 2xl:min-w-81 2xl:sticky 2xl:top-0 2xl:self-start">
                <img 
                    src={artSource} 
                    alt={`Front cover art for album ${album.name} by ${album.album_artist_name}`} 
                    className="bg-gray-700 object-contain md:w-40 md:h-40 2xl:w-81 2xl:h-81" >
                </img>
                <div className="flex flex-col-reverse pt-3 grow min-w-0 md:pt-0">
                    <div className="flex flex-row items-center font-sans font-light text-base md:text-xl pl-3 2xl:pl-0 text-slate-50 break-words">
                        <div onClick={onClickPlayAlbum} 
                            className="font-mono select-none text-3xl transition duration-300 hover:text-amber-500 hover:cursor-pointer">
                            ▶
                        </div>
                        <div>
                            &nbsp;{`${totalTrackCount} Tracks - ${secondsToTimeString(totalSecondsCount)}`}
                        </div>
                    </div>
                    <div className="font-sans font-sem text-xl md:text-3xl pl-3 2xl:pl-0 pb-1 md:pb-3 text-slate-50 break-words">
                        {album.album_artist_name}
                    </div>
                    <div className="flex flex-row text-3xl md:text-5xl pl-3 2xl:pl-0 pb-1 md:pb-3 2xl:pt-3 text-slate-50">
                        <div className="font-sans font-bold grow overflow-hidden break-words">
                            {album.name}
                        </div>
                        <div
                            onClick={onClickShowSettings} 
                            className="font-mono font-bold select-none transition duration-300 pt-1 pr-3 2xl:pr-0 md:hidden 2xl:block 2xl:hover:text-amber-500 hover:cursor-pointer">
                            ⋮
                        </div>
                    </div>
                    <div
                        onClick={onClickShowSettings}  
                        className="font-mono font-bold text-5xl text-slate-50 grow hidden md:block 2xl:hidden self-end select-none transition duration-300 hover:text-amber-500 hover:cursor-pointer">
                        ⋮
                    </div>
                </div>
            </div>
            {showSettings && <SettingsBox 
                    context={`Album ${album.id} Settings`} 
                    buttonsContent={settingsButtonsContent}
                    xOffset={onBiggerScreen ? xOffset + 160 : xOffset}
                    yOffset={yOffset}
                    setShowSettings={setShowSettings} />}
            <TrackListing 
                album={album}
                discsTrackCount={discsTrackCount}
                discsTimeCount={discsTimeCount}
                onBigScreen={onBigScreen}
                setTabTitle={setTabTitle}
                setnpAlbum={setnpAlbum}
                npTrack={npTrack}
                setnpTrack={setnpTrack}
                setNewTrack={setNewTrack}
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
        onBigScreen,
        setTabTitle,
        setnpAlbum,
        npTrack,
        setnpTrack,
        setNewTrack,
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
                onBigScreen={onBigScreen}
                setTabTitle={setTabTitle}
                setnpAlbum={setnpAlbum}
                npTrack={npTrack}
                setnpTrack={setnpTrack}
                setNewTrack={setNewTrack}
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
        onBigScreen,
        setTabTitle,
        setnpAlbum,
        npTrack,
        setnpTrack,
        setNewTrack,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ showPlayButton, setShowPlayButton ] = useState(false);
    const [ showSettings, setShowSettings ] = useState(false);
    const [ xOffset, setxOffset ] = useState(0);
    const [ yOffset, setyOffset ] = useState(0);

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
            onBigScreen={onBigScreen}
            setTabTitle={setTabTitle}
            setnpAlbum={setnpAlbum}
            npTrack={npTrack}
            setnpTrack={setnpTrack}
            setNewTrack={setNewTrack}
            explicitQueue={explicitQueue}
            setExplicitQueue={setExplicitQueue}
            setImplicitQueuePlaylist={setImplicitQueuePlaylist}
            setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
            setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
        />
    );

    const onEnterShowPlay = () => setShowPlayButton(true);
    const onLeaveHidePlay = () => setShowPlayButton(false);
    const onClickPlayDisc = () => {
        if (onBigScreen) {
            // only play while not on mobile
            // first track
            const track = discContent.tracks[0];

            setTabTitle(`${track.artist} - ${track.name} | musicthing`);
            setnpAlbum(album);
            setnpTrack(track);
            setNewTrack(true);

            setImplicitQueuePlaylist(album);
            setImplicitQueueDiscIndex(discIndex);
            setImplicitQueueTrackIndex(0);
        }
    }

    // settings window
    const onClickShowSettings = (e) => {
        setShowSettings(true);
        setxOffset(e.pageX);
        setyOffset(e.pageY);
    }
    const discForExplicitQueue = discContent.tracks.map((t) => [t, album]).reverse();
    const onClickQueueDiscTop = () => {
        setExplicitQueue([...explicitQueue, ...discForExplicitQueue]);
    }
    const onClickQueueDisc = () => {
        setExplicitQueue([...discForExplicitQueue, ...explicitQueue]);
    }
    const settingsButtonsContent = [
        ["Play Now", onClickPlayDisc],
        ["Play Next", onClickQueueDiscTop],
        ["Add to Queue", onClickQueueDisc],
    ];

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
                        <div className="text-xl select-none hover:cursor-pointer transition duration-300 hover:text-amber-500"
                            onClick={onClickShowSettings}>
                            &nbsp;&nbsp;…
                        </div>
                    </div>
                    {showSettings && <SettingsBox 
                        context={`Disc ${discIndex} album ${album.id} Settings`} 
                        buttonsContent={settingsButtonsContent}
                        xOffset={xOffset}
                        yOffset={yOffset}
                        setShowSettings={setShowSettings} />}
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
        onBigScreen,
        setTabTitle,
        setnpAlbum,
        npTrack,
        setnpTrack,
        setNewTrack,
        explicitQueue,
        setExplicitQueue,
        setImplicitQueuePlaylist,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;
    const [ showButton, setShowButton ] = useState(false);
    const [ showSettings, setShowSettings ] = useState(false);
    const [ xOffset, setxOffset ] = useState(0);
    const [ yOffset, setyOffset ] = useState(0);

    const onEnterShowButton = () => setShowButton(true);
    const onLeaveHideButton = () => setShowButton(false);

    const onClickPlayTrack = () => {
        setTabTitle(`${track.artist} - ${track.name} | musicthing`);
        setnpAlbum(album);
        setnpTrack(track);
        setNewTrack(true);

        // update queue
        setImplicitQueuePlaylist(album);
        setImplicitQueueDiscIndex(discIndex);
        setImplicitQueueTrackIndex(trackIndex);
    };

    // explicit queue's first is at last (for quick track popping)
    const onClickQueueTrackTop = () => setExplicitQueue([...explicitQueue, [track, album]]);
    const onClickQueueTrack = () => setExplicitQueue([[track, album], ...explicitQueue]);
    // const onClickShowDetails = () => console.log("DETAILS!!");

    const onClickShowSettings = (e) => {
        setShowSettings(true);
        setxOffset(e.pageX);
        setyOffset(e.pageY);
    }

    const playButton = 
    <div 
        className="font-mono select-none text-3xl hover:transition hover:duration-300 hover:cursor-pointer hover:text-amber-500 hover:md:text-amber-700" 
        onClick={onClickPlayTrack}>
        ▶
    </div>;

    const miscButtons = 
        <div className="flex flex-row font-mono select-none text-3xl gap-2">
            <div 
                title="Play Next"
                className="hidden md:block hover:transition hover:duration-300 hover:cursor-pointer hover:text-amber-700"
                onClick={onClickQueueTrackTop}>
                ±
            </div>
            <div 
                title="Add to Queue"
                className="hidden md:block hover:transition hover:duration-300 hover:cursor-pointer hover:text-amber-700"
                onClick={onClickQueueTrack}>
                ∓
            </div>
            <div
                title="Settings" 
                className="hover:transition hover:duration-300 hover:cursor-pointer hover:text-amber-700" 
                onClick={(e) => onClickShowSettings(e)} >
                …
            </div>
        </div>;

    let rightButton;
    if (onBigScreen && !showButton) {
        rightButton = <div>{secondsToTimeString(track.length_seconds)}</div>;
    } else {
        rightButton = miscButtons;
    }

    const settingsButtonsContent = [
        ["Play Now", onClickPlayTrack],
        ["Play Next", onClickQueueTrackTop],
        ["Add to Queue", onClickQueueTrack],
        // ["Details (TBD)", onClickShowDetails],
    ];

    const currPlaying = npTrack ? npTrack.id === track.id : false;
    return (
        <div 
            className="flex flex-row text-slate-50 items-center">
            {!onBigScreen && playButton}
            <div className={`flex flex-row grow min-w-0 overflow-hidden items-center justify-items-center ml-2 md:ml-4 my-1 h-8 rounded-lg drop-shadow-md bg-gray-500 transition ease-linear duration-200 ${currPlaying ?  "bg-slate-50 text-slate-700" : "hover:bg-slate-50 hover:text-slate-700"}`}
                onMouseEnter={onEnterShowButton} 
                onMouseLeave={onLeaveHideButton}
                id={currPlaying ? `${track.id}playing` : `${track.id}`}>
                <div className="flex justify-center font-sans text-sm shrink-0 md:text-2xl font-semibold mx-2 w-2 md:w-3">
                    {onBigScreen && showButton ? 
                            playButton : 
                            <div>{track.number}</div>}
                </div>
                <div
                    title={`${track.artist} - ${track.name}`} 
                    className="flex flex-col md:flex-row font-sans whitespace-nowrap overflow-hidden text-ellipsis">
                    <div 
                        className="text-base md:text-2xl font-semibold shrink-0 text-ellipsis">
                        {track.artist}
                    </div>
                    <div 
                        title={`${track.artist} - ${track.name}`}
                        className="text-lg md:text-2xl font-light md:px-2 overflow-hidden text-ellipsis">
                        {track.name}
                    </div>
                </div>
                <div className="ml-auto px-2">
                    {rightButton}
                </div>
            </div>
            {showSettings && <SettingsBox 
                context={`Track ${track.id} Settings`} 
                buttonsContent={settingsButtonsContent}
                xOffset={xOffset}
                yOffset={yOffset}
                setShowSettings={setShowSettings} /> }
        </div>
    );
}

export default Album;