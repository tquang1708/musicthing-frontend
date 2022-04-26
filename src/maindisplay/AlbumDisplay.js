import React, { useState, useEffect } from "react";
import MainDisplay from "./MainDisplay";

function AlbumDisplay(props) {
    const {
        serverUrl,
        displayType,
    } = props;
    const [ albums, setAlbums ] = useState([]);

    // get albums
    useEffect(() => {
        fetch(`${serverUrl}/api/list/albums`)
            .then((response) => response.json())
            .then((data) => setAlbums(data))
            .catch((error) => console.log(error));
    }, []);

    return (
        <MainDisplay
            items={albums}
            itemType="album"
            displayType={displayType}
            serverUrl={serverUrl}
        />
    );
}

export default AlbumDisplay;