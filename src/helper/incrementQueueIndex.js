export default function incrementQueueIndex(playlist, discIndex, trackIndex) {
    if (playlist) {
        const discs = playlist.discs;
        const currDiscTracks = discs[discIndex].tracks;

        if (trackIndex < currDiscTracks.length - 1) {
            return([ discIndex, trackIndex + 1 ]);
        } else {
            if (discIndex < discs.length - 1) {
                return([ discIndex + 1, 0 ]);
            }
        }
    }
        
    return([ discIndex, trackIndex ]); // don't update it otherwise
}