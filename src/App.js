import { React, useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import MediaPlayer from './mediaplayer/MediaPlayer';

function App() {
    const [ serverUrl, setServerUrl ] = useState(localStorage.getItem("serverUrl"));
    return(
        serverUrl === null 
            ? <Login setServerUrl={setServerUrl} /> 
            : <Player serverUrl={serverUrl} setServerUrl={setServerUrl}/>
    );
}

function Player(props) {
    const { serverUrl, setServerUrl } = props;
    const [ albumsState, setAlbumsState ] = useState([]);
    const [ nowPlaying, setNowPlaying ] = useState("");
    const [ artSource, setArtSource ] = useState("");
    const [ npSource, setnpSource ] = useState("");

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
                setNowPlaying = {setNowPlaying}
                setArtSource = {setArtSource}
                setnpSource = {setnpSource}
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

    const disconnect = () => {
        localStorage.removeItem('serverUrl');
        setServerUrl(null);
        location.reload();
    }

    return (
        <div>
            {/* <button onClick={reload}>Reload Metadata DB</button>
            <button onClick={hard_reload}>Hard-Reload Metadata DB</button> */}
            <button onClick={disconnect}>Disconnect from DB</button>
            <MediaPlayer nowPlaying={nowPlaying} artSource={artSource} npSource={npSource} />
            { listAlbums }
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
        setNowPlaying,
        setArtSource,
        setnpSource
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
                setNowPlaying = {setNowPlaying}
                setArtSource = {setArtSource}
                setnpSource = {setnpSource}
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
        setNowPlaying,
        setArtSource,
        setnpSource
    } = props;
    
    const listTracks = tracks.map((track) =>
        <div key={track.number + track.artist + track.name}>
            <Song
                album_artist={album_artist}
                album_name={album_name}
                album_art_path = {album_art_path}
                serverUrl={serverUrl}
                track={track}
                setNowPlaying = {setNowPlaying}
                setArtSource = {setArtSource}
                setnpSource = {setnpSource}
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
        setNowPlaying,
        setArtSource,
        setnpSource,
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
        setNowPlaying(`${track.artist} - ${track.name} - ${album_name}`);
        setArtSource(album_art_path);
        setnpSource(url);

        const a = document.querySelector('audio');
        a.load();
        a.play();
    }

    return (
    <div className = "track">
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
