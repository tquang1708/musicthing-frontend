import React from "react";

export default function Queue(props) {
    const {
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
    } = props;

    return (
        <div className="bg-gray-500">Queue</div>
    );
}