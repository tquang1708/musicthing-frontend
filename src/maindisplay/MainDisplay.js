import React from 'react';
import { Link } from "react-router-dom";

import unknown_album from '../unknown_album.svg';

function MainDisplay(props) {
    const {
        items,
        serverUrl,
        displayType,
        defaultTitle,
        defaultSubtitle,
    } = props;

    // just tiles for now
    let display;
    if (displayType === "tiles") {
        const listItems = items.map((i) => 
            <div key={i.key} className="item">
                <MainDisplayTile 
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
            <div>
                <div className="h-0 md:h-20"></div>
                <div className="grid p-2 gap-4 md:gap-6 grid-cols-auto-mobile md:grid-cols-auto">
                    {listItems}
                </div>
            </div>
    } else {
        display = null;
    }

    return display;
}

function MainDisplayTile(props) {
    const {
        imgSource,
        title,
        noTitle,
        subtitle,
        noSubtitle,
        linkTo,
    } = props;

    return (
        <Link to={`${linkTo}`}>
            <div className="flex flex-col p-1.5 rounded-lg drop-shadow-md bg-gray-500 text-slate-50 transition ease-linear duration-200 hover:bg-gray-300 hover:text-slate-700 hover:cursor-pointer hover:drop-shadow-none">
                <img
                    src={imgSource}
                    alt={`Art for ${title}`}
                    className="object-contain h-12 md:h-20 drop-shadow-md" >
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
        </Link>
    );
}

export default MainDisplay;
