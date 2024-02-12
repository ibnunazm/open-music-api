exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlistId: {
      type: "VARCHAR(50)",
      notNull: false,
      references: "playlists",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    songId: {
      type: "VARCHAR(50)",
      notNull: false,
      references: "songs",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  pgm.addConstraint(
    "playlist_songs",
    "unique_playlistId_and_songId",
    'UNIQUE("playlistId", "songId")'
  );

  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.playlistId_playlists.id",
    'FOREIGN KEY("playlistId") REFERENCES playlists(id)'
  );
  pgm.addConstraint(
    "playlist_songs",
    "fk_playlist_songs.songId_songs.id",
    'FOREIGN KEY("songId") REFERENCES songs(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
