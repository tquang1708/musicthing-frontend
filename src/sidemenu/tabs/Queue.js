import React from "react";
import secondsToTimeString from "../../helper/secondsToTimeString";

export default function Queue(props) {
    const {
        explicitQueue,
        //setExplicitQueue
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        // setImplicitQueueDiscIndex,
        // setImplicitQueueTrackIndex,
    } = props;

    let implicitQueueItems;
    if (implicitQueuePlaylist) {
        const discs = implicitQueuePlaylist.discs;

        implicitQueueItems = discs.map((disc, i) => {
            if (i >= implicitQueueDiscIndex) {
                // current disc with track
                return disc.tracks.map(((track, j) => {
                    if ((i == implicitQueueDiscIndex && j > implicitQueueTrackIndex) || i > implicitQueueDiscIndex) {
                        return <div 
                            key={`implicit queue ${implicitQueuePlaylist.id} ${track.number} ${track.artist} ${track.name}}`}
                            className="flex flex-col">
                            <div>
                                {track.number}. {track.artist} - {track.name} ({secondsToTimeString(track.length_seconds)})
                            </div>
                        </div>
                    }
                }))
            }
        });
    } else {
        implicitQueueItems = [];
    }

    // explicit queue is reversed
    const explicitQueueItems = explicitQueue.map((track) => 
        <div key={`explicit queue ${track.id}`}>
            {track.number}. {track.artist} - {track.name} ({secondsToTimeString(track.length_seconds)})
        </div>
    ).reverse();

    console.log(explicitQueue);
    console.log(explicitQueueItems);

    return (
        <div className="bg-gray-500">
            {explicitQueueItems}
            {implicitQueueItems}
        </div>
    );
}