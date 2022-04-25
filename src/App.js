import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Login from './Login';
import MediaPlayer from './mediaplayer/MediaPlayer';
import MainDisplay from './maindisplay/MainDisplay';

function App() {
    const [ serverUrl, setServerUrl ] = useState(localStorage.getItem("serverUrl"));
    const [ tabTitle, setTabTitle ] = useState("musicthing");
    
    const mainApp = serverUrl === null 
        ? <Login setServerUrl={setServerUrl} /> 
        : <Player 
            serverUrl={serverUrl} 
            setTabTitle={setTabTitle} 
          />;

    return(
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>{tabTitle}</title>
            </Helmet>
            {mainApp}
        </div>
    );
}

function Player(props) {
    const { serverUrl, setTabTitle } = props;
    const [ albumsState, setAlbumsState ] = useState([]);
    const [ artSource, setArtSource ] = useState("");
    const [ npSource, setnpSource ] = useState("");
    const [ npArtist, setnpArtist ] = useState("Unknown Artist");
    const [ npAlbum, setnpAlbum ] = useState("Unknown Album");
    const [ npTitle, setnpTitle ] = useState("Untitled");
    const [ isPlaying, setIsPlaying ] = useState(false);

    useEffect(() => {
        fetch(`${serverUrl}/api/list`)
            .then((response) => response.json())
            .then((data) => setAlbumsState(data.albums))
            .catch((error) => console.log(error));
    }, []);

    const listAlbums = albumsState.map((album) =>
        <div key={album.name + album.album_artist_name}>
            <h2>{album.name}</h2>
            <h3>{album.album_artist_name}</h3>
            <Discs
                discs = {album.discs}
                album_artist = {album.album_artist_name}
                album_name = {album.name}
                album_art_path = {`${serverUrl}/art/${album.album_art_path}`}
                serverUrl = {serverUrl}
                setnpArtist = {setnpArtist}
                setnpAlbum = {setnpAlbum}
                setnpTitle = {setnpTitle}
                setArtSource = {setArtSource}
                setnpSource = {setnpSource}
                setTabTitle = {setTabTitle}
                setIsPlaying = {setIsPlaying}
            />
        </div>
    );

    // const reload = () => {
    //     fetch(`${serverUrl}/api/reload`)
    //         .then((response) => response.text())
    //         .then(() => location.reload())
    //         .catch((error) => console.log(error));
    // }

    // const hard_reload = () => {
    //     fetch(`${serverUrl}/api/hard_reload`)
    //         .then((response) => response.text())
    //         .then(() => location.reload())
    //         .catch((error) => console.log(error));
    // }

    // const disconnect = () => {
    //     localStorage.removeItem('serverUrl');
    //     setServerUrl(null);
    //     location.reload();
    // }

    return (
        <div className="bg-gray-600">
            {/* <button onClick={reload}>Reload Metadata DB</button>
            <button onClick={hard_reload}>Hard-Reload Metadata DB</button> */}
            {/* <button onClick={disconnect}>Disconnect from DB</button> */}
            <div className="h-0 md:h-20"></div>
            <MediaPlayer 
                artSource={artSource}
                npSource={npSource}
                npArtist={npArtist}
                npAlbum={npAlbum}
                npTitle={npTitle}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />
            <MainDisplay 
                serverUrl={serverUrl}
            />
            {/* { listAlbums } */}
            <div className="h-8 md:h-20"></div>
        </div>
    );
}

function Discs(props) {
    const {
        discs,
        album_artist,
        album_name,
        album_art_path,
        serverUrl,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setArtSource,
        setnpSource,
        setTabTitle,
        setIsPlaying,
    } = props;

    const listDiscs = discs.map((disc) =>
        <div key={album_name + album_artist + disc.number}>
            <h5>Disc {disc.number}</h5>
            <Songs 
                album_artist={album_artist}
                album_name = {album_name}
                album_art_path = {album_art_path}
                tracks={disc.tracks}
                serverUrl={serverUrl}
                setnpArtist = {setnpArtist}
                setnpAlbum = {setnpAlbum}
                setnpTitle = {setnpTitle}
                setArtSource = {setArtSource}
                setnpSource = {setnpSource}
                setTabTitle = {setTabTitle}
                setIsPlaying = {setIsPlaying}
            />
        </div>
    );

    return (
        <div>{ listDiscs }</div>
    );
}

function Songs(props) {
    const {
        album_artist,
        album_name,
        album_art_path,
        tracks,
        serverUrl,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setArtSource,
        setnpSource,
        setTabTitle,
        setIsPlaying,
    } = props;
    
    const listTracks = tracks.map((track) =>
        <div key={track.path}>
            <Song
                album_artist={album_artist}
                album_name={album_name}
                album_art_path = {album_art_path}
                serverUrl={serverUrl}
                track={track}
                setnpArtist = {setnpArtist}
                setnpAlbum = {setnpAlbum}
                setnpTitle = {setnpTitle}
                setArtSource = {setArtSource}
                setnpSource = {setnpSource}
                setTabTitle = {setTabTitle}
                setIsPlaying = {setIsPlaying}
            />
        </div>
    )

    return (<div>{ listTracks }</div>);
}

function Song(props) {
    const {
        album_artist,
        track,
        album_name,
        album_art_path,
        serverUrl,
        setnpArtist,
        setnpAlbum,
        setnpTitle,
        setArtSource,
        setnpSource,
        setTabTitle,
        setIsPlaying,
    } = props;

    // set track text
    let text;
    if (album_artist === track.artist) {
        text = `${track.name}`
    } else {
        text = `${track.artist} - ${track.name}`
    }

    // format track length
    // https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
    let hours = Math.floor(track.length_seconds / 3600);
    let minutes = Math.floor((track.length_seconds - hours * 3600) / 60);
    let seconds = track.length_seconds - hours * 3600 - minutes * 60;

    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    
    let length_formatted;
    if (hours === 0) {
        length_formatted = `${minutes}:${seconds}`;
    } else {
        length_formatted = `${hours}:${minutes}:${seconds}`;
    }

    const url = `${serverUrl}/track/` + track.path;
    const filename = track.path.split("/").pop();

    const updatePlayer = () => {
        setnpArtist(track.artist);
        setnpAlbum(album_name);
        setnpTitle(track.name);
        setArtSource(album_art_path);
        setnpSource(url);
        setTabTitle(`${track.artist} - ${track.name} | musicthing`)
        setIsPlaying(true);
    }

    return (
    <div>
        <button onClick={() => updatePlayer()}>▶</button>
        {track.number + ". "}
        <a 
            href = {url}
            download = {filename}
            target="_blank" rel="noreferrer">
            {text}
        </a>
        <small>&nbsp;{length_formatted}</small>
    </div>);
}

export default App;
