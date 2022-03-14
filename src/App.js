import { React, useState, useEffect } from 'react';
import './App.css';
import { options } from './options.js';

function App() {
    const [ albumsState, setAlbumsState ] = useState([]);
    const [ nowPlaying, setNowPlaying ] = useState("");
    const [ npSource, setnpSource ] = useState("");

    useEffect(() => {
        fetch(`${options.server_url}/api/list`)
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
                setNowPlaying = {setNowPlaying}
                setnpSource = {setnpSource}
            />
        </div>
    );

    const reload = () => {
        fetch(`${options.server_url}/api/reload`)
            .then((response) => response.text())
            .then(() => location.reload())
            .catch((error) => console.log(error));
    }

    const hard_reload = () => {
        fetch(`${options.server_url}/api/hard_reload`)
            .then((response) => response.text())
            .then(() => location.reload())
            .catch((error) => console.log(error));
    }

    return (
        <div>
            <button onClick={reload}>Reload Metadata DB</button>
            <button onClick={hard_reload}>Hard-Reload Metadata DB</button>
            <MediaPlayer nowPlaying={nowPlaying} npSource={npSource} />
            { listAlbums }
        </div>
    );
}

function Discs(props) {
    const { discs, album_artist, album_name, setNowPlaying, setnpSource } = props;

    const listDiscs = discs.map((disc) =>
        <div key={album_name + album_artist + disc.number}>
            <h5>Disc {disc.number}</h5>
            <Songs 
                album_artist={album_artist}
                album_name = {album_name}
                tracks={disc.tracks}
                setNowPlaying = {setNowPlaying}
                setnpSource = {setnpSource}
            />
        </div>
    );

    return (
        <div>{ listDiscs }</div>
    );
}

function Songs(props) {
    const { album_artist, album_name, tracks, setNowPlaying, setnpSource } = props;
    
    const listTracks = tracks.map((track) =>
        <div key={track.number + track.artist + track.name}>
            <Song
                album_artist={album_artist}
                album_name={album_name}
                track={track}
                setNowPlaying = {setNowPlaying}
                setnpSource = {setnpSource}
            />
        </div>
    )

    return (<div>{ listTracks }</div>);
}

function Song(props) {
    const { album_artist, track, album_name, setNowPlaying, setnpSource } = props;

    let text;
    if (album_artist == track.artist) {
        text = `${track.name}`
    } else {
        text = `${track.artist} - ${track.name}`
    }

    const url = `${options.server_url}/static/` + track.path;
    const filename = track.path.split("/").pop();

    const updatePlayer = () => {
        setNowPlaying(`${track.artist} - ${track.name} - ${album_name}`);
        setnpSource(url);

        const a = document.querySelector('audio');
        a.load();
        a.play();
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
    </div>);
}

function MediaPlayer(props) {
    const { nowPlaying, npSource } = props;

    return (
        <div>
            <h3>Now Playing: {nowPlaying}</h3>
            <audio 
                controls 
                preload="auto">
                <source src={npSource} />
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
    );
}

export default App;
