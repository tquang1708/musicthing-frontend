import React from "react";
import secondsToTimeString from "../../helper/secondsToTimeString";

export default function Queue(props) {
    const {
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        // setImplicitQueueDiscIndex,
        // setImplicitQueueTrackIndex,
    } = props;

    let upcomingTracks;
    if (implicitQueuePlaylist) {
        const discs = implicitQueuePlaylist.discs;

        upcomingTracks = discs.map((disc, i) => {
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
        upcomingTracks = [];
    }

    return (
        <div className="bg-gray-500">
            {upcomingTracks}
        </div>
    );
}