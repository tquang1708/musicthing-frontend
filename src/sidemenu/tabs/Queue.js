import React from "react";
import secondsToTimeString from "../../misc/helper/secondsToTimeString";

export default function Queue(props) {
    const {
        explicitQueue,
        setExplicitQueue,
        setInExplicitQueue,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        setNewTrack,
        setnpTrack,
        setnpAlbum,
        setTabTitle,
    } = props;

    const onClickSkipToImplicitQueueTrack = (i, j) => {
        const nextnpTrack = implicitQueuePlaylist.discs[i].tracks[j];
        setNewTrack(true);
        setnpTrack(nextnpTrack);
        setnpAlbum(implicitQueuePlaylist);
        setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        setInExplicitQueue(true);

        // skipping to an implicit queue track means skipping past the explicit queue too
        setExplicitQueue([]);
        setInExplicitQueue(false);
        setImplicitQueueDiscIndex(i);
        setImplicitQueueTrackIndex(j);
    }
    let implicitQueueItems;
    if (implicitQueuePlaylist) {
        const discs = implicitQueuePlaylist.discs;

        implicitQueueItems = discs.map((disc, i) => {
            if (i >= implicitQueueDiscIndex) {
                // current disc with track
                return disc.tracks.map(((track, j) => {
                    if ((i == implicitQueueDiscIndex && j > implicitQueueTrackIndex) || i > implicitQueueDiscIndex) {
                        return <div 
                            key={`implicit queue ${implicitQueuePlaylist.id} ${track.id}}`}
                            className="flex flex-row items-center gap-1.5 pl-0.5">
                            <div
                                onClick={() => onClickSkipToImplicitQueueTrack(i, j)}
                                className="select-none text-xl hover:text-amber-500 hover:cursor-pointer">
                                ▶
                            </div>
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

    const onClickSkipToExplicitQueueTrack = (index) => {
        const [ nextnpTrack, nextnpAlbum ] = explicitQueue[index];
        setNewTrack(true);
        setnpTrack(nextnpTrack);
        setnpAlbum(nextnpAlbum);
        setTabTitle(`${nextnpTrack.artist} - ${nextnpTrack.name} | musicthing`);
        setInExplicitQueue(true);

        setExplicitQueue((explicitQueue) => {
            return explicitQueue.filter((v, i) => i < index);
        });
    }
    const onClickRemoveFromExplicitQueue = (index) => {
        setExplicitQueue((explicitQueue) => {
            return explicitQueue.filter((v, i) => i !== index);
        });
    };
    const onClickClearExplicitQueue = () => setExplicitQueue([]);

    // explicit queue is reversed
    const explicitQueueLength = explicitQueue.length;
    const explicitQueueItems = explicitQueue.map((item, i) => {
        const [ track, album ] = item;
        return <div key={`explicit queue ${track.id} ${i}`}
            className="flex flex-row justify-left items-center gap-1.5 pl-0.5">
            <div
                onClick={() => onClickSkipToExplicitQueueTrack(i)}
                className="select-none text-xl hover:text-amber-500 hover:cursor-pointer">
                ▶
            </div>
            <div>
                {explicitQueueLength - i}. {track.artist} - {track.name} - {album.name} ({secondsToTimeString(track.length_seconds)})
            </div>
            <div
                onClick={() => onClickRemoveFromExplicitQueue(i)}
                className="select-none text-5xl ml-auto hover:text-amber-500 hover:cursor-pointer">
                -
            </div>
        </div>
    }).reverse();
    
    return (
        <div className="bg-gray-500">
            <div className="flex flex-row justify-between">
                <div>
                    Explicit Queue
                </div>
                <div
                    onClick={onClickClearExplicitQueue} 
                    className="select-none hover:cursor-pointer hover:underline">
                    Clear All
                </div>
            </div>
            {explicitQueueItems}
            <div>Implicit Queue</div>
            {implicitQueueItems}
        </div>
    );
}