import React from 'react';

function ControlButtons(props) {
    const {
        serverUrl,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        isPlaying,
        setIsPlaying,
        setnpSource,
        setnpArtist,
        setnpTitle,
    } = props;

    return (
        <div className="flex flex-row justify-between items-center">
            <PrevButton 
                serverUrl={serverUrl}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpTitle={setnpTitle}
            />
            <PlayPauseButton 
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying} />
            <NextButton 
                serverUrl={serverUrl}
                implicitQueuePlaylist={implicitQueuePlaylist}
                implicitQueueDiscIndex={implicitQueueDiscIndex}
                implicitQueueTrackIndex={implicitQueueTrackIndex}
                setImplicitQueueDiscIndex={setImplicitQueueDiscIndex}
                setImplicitQueueTrackIndex={setImplicitQueueTrackIndex}
                setnpSource={setnpSource}
                setnpArtist={setnpArtist}
                setnpTitle={setnpTitle}
            />
        </div>
    );
}

function PrevButton(props) {
    const {
        serverUrl,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        setnpSource,
        setnpArtist,
        setnpTitle,
    } = props;

    const onClickPrevTrack = () => {
        if (implicitQueuePlaylist) {
            let newTrack;
            const discs = implicitQueuePlaylist.discs;
    
            if (implicitQueueTrackIndex > 0) {
                newTrack = implicitQueuePlaylist.discs[implicitQueueDiscIndex].tracks[implicitQueueTrackIndex - 1];
                setImplicitQueueTrackIndex(implicitQueueTrackIndex - 1);
            } else {
                if (implicitQueueDiscIndex > 0) {
                    const prevDiscTracks = discs[implicitQueueDiscIndex - 1].tracks;
                    newTrack = prevDiscTracks[prevDiscTracks.length - 1];

                    setImplicitQueueDiscIndex(implicitQueueDiscIndex - 1);
                    setImplicitQueueTrackIndex(prevDiscTracks.length - 1);
                }
            }

            // no need to set new album since we're assuming we're still playing off the implicit playlist
            if (newTrack) {
                setnpSource(`${serverUrl}/track/${newTrack.path}`);
                setnpArtist(`${newTrack.artist}`);
                setnpTitle(`${newTrack.name}`);
            }
        }
        
    }

    return (
        <div onClick={onClickPrevTrack}
            className="transition duration-300 hover:text-amber-500 hover:cursor-pointer">
            ⏮
        </div>
    );
}

function PlayPauseButton(props) {
    const {
        isPlaying,
        setIsPlaying,
    } = props;

    const onPlayPauseClick = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <button 
            onClick={onPlayPauseClick}
            className="font-mono font-medium text-3xl text-slate-50 md:hover:text-amber-500 transition duration-300">
            {isPlaying ? "⏸" : "▶"}
        </button>
    );
}

function NextButton(props) {
    const {
        serverUrl,
        implicitQueuePlaylist,
        implicitQueueDiscIndex,
        implicitQueueTrackIndex,
        setImplicitQueueDiscIndex,
        setImplicitQueueTrackIndex,
        setnpSource,
        setnpArtist,
        setnpTitle,
    } = props;

    const onClickNextTrack = () => {
        if (implicitQueuePlaylist) {
            let newTrack = null;
            const discs = implicitQueuePlaylist.discs;
            const currDiscTracks = discs[implicitQueueDiscIndex].tracks;
    
            if (implicitQueueTrackIndex < currDiscTracks.length - 1) {
                newTrack = currDiscTracks[implicitQueueTrackIndex + 1];
                setImplicitQueueTrackIndex(implicitQueueTrackIndex + 1);
            } else {
                if (implicitQueueDiscIndex < discs.length - 1) {
                    const nextDiscTracks = discs[implicitQueueDiscIndex + 1].tracks;
                    newTrack = nextDiscTracks[0];

                    setImplicitQueueDiscIndex(implicitQueueDiscIndex + 1);
                    setImplicitQueueTrackIndex(0);
                }
            }

            if (newTrack) {
                setnpSource(`${serverUrl}/track/${newTrack.path}`);
                setnpArtist(`${newTrack.artist}`);
                setnpTitle(`${newTrack.name}`);
            }
        }
    }

    return (
        <div onClick={onClickNextTrack}
            className="transition duration-300 hover:text-amber-500 hover:cursor-pointer">
            ⏭
        </div>
    );
}

export {
    ControlButtons,
    PlayPauseButton,
}