import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
} from 'react-router-dom';
import Login from './Login';
import MediaPlayer from './mediaplayer/MediaPlayer';
import AlbumDisplay from './maindisplay/AlbumDisplay';
import Album from './maindisplay/Album';

import unknown_album from './unknown_album.svg';

function App() {
    const [ serverUrl, setServerUrl ] = useState(localStorage.getItem("serverUrl"));
    const [ tabTitle, setTabTitle ] = useState("musicthing");
    const [ artSource, setArtSource ] = useState(unknown_album);
    const [ npSource, setnpSource ] = useState("");
    const [ npArtist, setnpArtist ] = useState("Unknown Artist");
    const [ npAlbum, setnpAlbum ] = useState(null);
    const [ npTitle, setnpTitle ] = useState("Untitled");
    const [ isPlaying, setIsPlaying ] = useState(false);
    
    const mainApp = serverUrl === null 
        ? <Login setServerUrl={setServerUrl} /> 
        : <Main 
            tabTitle={tabTitle}
            artSource={artSource}
            npSource={npSource}
            npArtist={npArtist}
            npAlbum={npAlbum}
            npTitle={npTitle}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />;

    const albumDisplay = 
        <AlbumDisplay 
            serverUrl={serverUrl}
            displayType="tiles"
        />

    const album =
        <Album 
            serverUrl={serverUrl}
            backLinkTo="/album"
            setTabTitle={setTabTitle}
            setArtSource={setArtSource}
            setnpSource={setnpSource}
            setnpArtist={setnpArtist}
            setnpAlbum={setnpAlbum}
            setnpTitle={setnpTitle}
            setIsPlaying={setIsPlaying}
        />

    return(
        <Router>
            <Routes>
                <Route path="/" element={mainApp}>
                    <Route index element={albumDisplay} />
                    <Route path="album" element={albumDisplay} />
                    <Route path="album/:id" element={album} />
                </Route>
            </Routes>
        </Router>
    );
}

function Main(props) {
    const { 
        tabTitle,
        artSource,
        npSource,
        npArtist,
        npAlbum,
        npTitle,
        isPlaying,
        setIsPlaying,
    } = props;

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
             <Helmet>
                <meta charSet="utf-8" />
                <title>{tabTitle}</title>
            </Helmet>
            {/* <button onClick={reload}>Reload Metadata DB</button>
            <button onClick={hard_reload}>Hard-Reload Metadata DB</button> */}
            {/* <button onClick={disconnect}>Disconnect from DB</button> */}
            <MediaPlayer 
                artSource={artSource}
                npSource={npSource}
                npArtist={npArtist}
                npAlbum={npAlbum}
                npTitle={npTitle}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
            />
            <Outlet />
            <div className="h-8 md:h-20"></div>
        </div>
    );
}

export default App;
