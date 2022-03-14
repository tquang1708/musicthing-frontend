import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import { options } from './options.js';

function App() {
    const [albumsState, setAlbumsState] = useState([]);

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
            <Discs discs={album.discs} album_artist={album.album_artist_name}  album_name = {album.name}/>
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
            { listAlbums }
        </div>
    );
}

function Discs(props) {
    const { discs, album_artist, album_name } = props;

    const listDiscs = discs.map((disc) =>
        <div key={album_name + album_artist + disc.number}>
            <h5>Disc {disc.number}</h5>
            <Songs album_artist={album_artist} tracks={disc.tracks} />
        </div>
    );

    return (
        <div>{ listDiscs }</div>
    );
}
Discs.propTypes = {
    discs: PropTypes.array,
    album_artist: PropTypes.string,
    album_name: PropTypes.string
}

function Songs(props) {
    const { album_artist, tracks } = props;
    
    const listTracks = tracks.map((track) =>
        <div key={track.number + track.artist + track.name}>
            <Song album_artist={album_artist} track={track} />
        </div>
    )

    return (<div>{ listTracks }</div>);
}
Songs.propTypes = {
    album_artist: PropTypes.string,
    tracks: PropTypes.array
}

function Song(props) {
    const { album_artist, track } = props;

    let text;
    if (album_artist == track.artist) {
        text = `${track.name}`
    } else {
        text = `${track.artist} - ${track.name}`
    }

    const url = `${options.server_url}/static` + track.path;
    const filename = track.path.split("/").pop();
    return (
    <div>
        {track.number + ". "}
        <a 
            href = {url}
            download = {filename}
            target="_blank" rel="noreferrer">
            {text}
        </a>
    </div>);
}
Song.propTypes = {
    album_artist: PropTypes.string,
    track: PropTypes.map
}

export default App;
