import React from "react";
import secondsToTimeString from "../../misc/helper/secondsToTimeString";

export default function Queue(props) {
    const {
        explicitQueue,
        setExplicitQueue,
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

    const onClickRemoveFromExplicitQueue = (index) => {
        setExplicitQueue((explicitQueue) => {
            return explicitQueue.filter((v, i) => i !== index);
        });
    };

    // explicit queue is reversed
    const explicitQueueLength = explicitQueue.length;
    const explicitQueueItems = explicitQueue.map((item, i) => {
        const [ track, album ] = item;
        return <div key={`explicit queue ${track.id} ${i}`}
            className="flex flex-row justify-between">
            <div>
                {explicitQueueLength - i}. {track.artist} - {track.name} - {album.name} ({secondsToTimeString(track.length_seconds)})
            </div>
            <div
                onClick={() => onClickRemoveFromExplicitQueue(i)}
                className="select-none text-5xl hover:text-amber-500 hover:cursor-pointer">
                -
            </div>
        </div>
    }).reverse();
    
    return (
        <div className="bg-gray-500">
            <div>Explicit Queue</div>
            {explicitQueueItems}
            <div>Implicit Queue</div>
            {implicitQueueItems}
        </div>
    );
}