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

    // generate items for main display
    const listItems = albums.map((album) => {
        return {
            key: `Album ${album.id}`,
            title: album.name,
            subtitle: album.artist_name,
            art_path: album.art_path,
            link_to: `/album/${album.id}`,
        }
    });

    return (
        <MainDisplay
            items={listItems}
            serverUrl={serverUrl}
            displayType={displayType}
            defaultTitle="Unknown Album"
            defaultSubtitle="Unknown Artist"
        />
    );
}

export default AlbumDisplay;