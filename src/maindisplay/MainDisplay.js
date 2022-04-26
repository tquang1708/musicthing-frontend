import React from 'react';

function MainDisplay(props) {
    const {
        items,
        itemType,
        serverUrl,
    } = props;

    // just albums for now
    let listItems;
    if (itemType === "album") {
        // generate tiles for album
        listItems = items.map((i) => 
            <div key={`${itemType} + ${i.id}`} className="item">
                <MainDisplayTile 
                    imgSource={`${serverUrl}/art/${i.art_path}`}
                    title={i.name}
                    noTitle="Unknown Album"
                    subtitle={i.artist_name}
                    noSubtitle="Unknown Artist"
                />
            </div>
            );
    } else {
        listItems = [];
    }

    return (
        <div className="grid p-2 gap-4 md:gap-6 grid-cols-auto-mobile md:grid-cols-auto">
            {listItems}
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
