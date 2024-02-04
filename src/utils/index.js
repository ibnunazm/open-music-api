const mapAlbumSongs = (e) => {
  const newObjSong = {
    id: e.song_id,
    title: e.song_title,
    performer: e.song_performer,
  };
  return newObjSong;
};

const mapSearchSongs = (e) => {
  const newObjSong = {
    id: e.id,
    title: e.title,
    performer: e.performer,
  };
  return newObjSong;
};

module.exports = { mapAlbumSongs, mapSearchSongs };
