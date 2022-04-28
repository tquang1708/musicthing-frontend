import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import unknown_album from '../unknown_album.svg';

function AlbumDisplay(props) {
    const {
        serverUrl,
        setSidebarOverlay,
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
        <TilesGridDisplay
            items={listItems}
            serverUrl={serverUrl}
            defaultTitle="Unknown Album"
            defaultSubtitle="Unknown Artist"
            setSidebarOverlay={setSidebarOverlay}
        />
    );
}

function TilesGridDisplay(props) {
    const {
        items,
        serverUrl,
        defaultTitle,
        defaultSubtitle,
        setSidebarOverlay,
    } = props;

    // sidebar should not overlay on main display
    useEffect(() => {
        setSidebarOverlay(false);
    }, []);

    // just tiles for now
    let display;
    const listItems = items.map((i) => 
        <div key={i.key} className="item">
            <Tile 
                imgSource={i.art_path ? `${serverUrl}/art/${i.art_path}` : unknown_album}
                title={i.title}
                noTitle={defaultTitle}
                subtitle={i.subtitle}
                noSubtitle={defaultSubtitle}
                linkTo={i.link_to}
            />
        </div>
    );
    display = 
        <div className="grow">
            <div className="h-0 md:h-20"></div>
            <div className="grid p-2 gap-4 md:gap-6 justify-evenly grid-cols-auto-mobile md:grid-cols-auto">
                {listItems}
            </div>
        </div>

    return display;
}

function Tile(props) {
    const {
        imgSource,
        title,
        noTitle,
        subtitle,
        noSubtitle,
        linkTo,
    } = props;
    const [ showButton, setShowButton ] = useState(false);

    const onEnterShowButton = () => setShowButton(true);
    const onLeaveHideButton = () => setShowButton(false);
    
    return (
        <Link to={`${linkTo}`}>
            <div onMouseEnter={onEnterShowButton} onMouseLeave={onLeaveHideButton}
                className="flex flex-col p-1.5 rounded-lg drop-shadow-md bg-gray-500 text-slate-50 transition ease-linear duration-200 hover:bg-gray-300 hover:text-slate-700 hover:cursor-pointer hover:drop-shadow-none">
                <img
                    src={imgSource}
                    alt={`Art for ${title}`}
                    className="object-contain h-12 md:h-20" >
                </img>
                <div className="flex flex-col">
                    <div className="flex flex-row">
                        <div
                            className="font-sans font-bold truncate grow">
                            {title ? title : noTitle}
                        </div>
                        <div className={`font-mono font-bold text-xl md:text-2xl select-none ${showButton ? "md:visible" : "md:invisible"} hover:text-amber-700`}>
                            ⋮
                        </div>
                    </div>
                    <div
                        className="font-sans font-light truncate">
                        {subtitle ? subtitle : noSubtitle}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default AlbumDisplay;