import React, { useState, useEffect } from 'react';

// just albums for now
function MainDisplay(props) {
    const {
        serverUrl,
    } = props;
    const [ albums, setAlbums ] = useState([]);

    // get albums
    useEffect(() => {
        fetch(`${serverUrl}/api/list/albums`)
            .then((response) => response.json())
            .then((data) => setAlbums(data))
            .catch((error) => console.log(error));
    }, []);

    // generate tiles based on albums
    const listAlbums = albums.map((album) => 
        <div 
            key={"AlbumID" + album.id}
            className="item" >
            <MainDisplayTile 
                imgSource={`${serverUrl}/art/${album.art_path}`}
                title={album.name}
                noTitle="Unknown Album"
                subtitle={album.artist_name}
                noSubtitle="Unknown Artist"
            />
        </div>
    );

    return (
        <div className="grid p-2 gap-4 md:gap-6 grid-cols-auto-mobile md:grid-cols-auto">
            {listAlbums}
        </div>
    );
}

function MainDisplayTile(props) {
    const {
        imgSource,
        title,
        noTitle,
        subtitle,
        noSubtitle,
    } = props;

    return (
        <div className="flex flex-col p-1.5 rounded-lg bg-gray-500 text-slate-50 transition ease-linear duration-200 hover:bg-gray-300 hover:text-slate-700 hover:cursor-pointer">
            <img
                src={imgSource}
                alt={`Art for ${title}`}
                className="object-contain h-16 md:h-20" >
            </img>
            <div
                className="font-sans font-bold truncate">
                {title ? title : noTitle}
            </div>
            <div
                className="font-sans font-light truncate">
                {subtitle ? subtitle : noSubtitle}
            </div>
        </div>
    );
}

export default MainDisplay;
