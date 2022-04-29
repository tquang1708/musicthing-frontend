import unknown_album from '../../unknown_album.svg';

export default function unwrapMetadata(serverUrl, npTrack, npAlbum) {
    return ({
        "artSource": npTrack && npTrack.art_path ? `${serverUrl}/api/art/${npTrack.art_path}` : unknown_album,
        "title": npTrack ? npTrack.name : "Untitled",
        "artist": npTrack ? npTrack.artist : "Unknown Artist",
        "album": npAlbum ? npAlbum.name : "Unknown Album",
    });
}