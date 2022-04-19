import React from 'react';

function MediaPlayer(props) {
    const { nowPlaying, artSource, npSource } = props;

    return (
        <div>
            <img 
                src={artSource} 
                alt={`Front cover art for ${nowPlaying}`} 
                width="300" 
                height="300">
            </img>
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

export default MediaPlayer;