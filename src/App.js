import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';

function App() {
    const [albumsState, setAlbumsState] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/list')
            .then((response) => response.json())
            .then((data) => setAlbumsState(data.albums))
            .catch((error) => console.log(error));
    });

    const listAlbums = albumsState.map((album) =>
        <div key={album.name}>
            <h3>{album.name}</h3>
            <p>by {album.album_artist_name}</p>
            <Songs discs={album.discs} album_artist={album.album_artist_name} />
        </div>
    );

    return (
        <div>{ listAlbums }</div>
    );
}

function Songs(props) {
    const { discs, album_artist } = props;

    let listSongs;
    if (discs.length == 1) {
        listSongs = discs[0].tracks.map((song) => {
                if (song.artist != album_artist) {
                    return <li>{song.number}. {song.artist} - {song.name}</li>;
                } else {
                    return <li>{song.number}. {song.name}</li>;
                }
            }
        );
    } else {
        //
    }

    return (
        <ul style={{listStyleType: "none"}}>{ listSongs }</ul>
    )
}
Songs.propTypes = {
    discs: PropTypes.array,
    album_artist: PropTypes.string
}

export default App;
