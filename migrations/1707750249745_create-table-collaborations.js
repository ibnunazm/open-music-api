exports.up = (pgm) => {
  pgm.createTable("collaborations", {
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
    userId: {
      type: "VARCHAR(50)",
      notNull: false,
      references: "users",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  pgm.addConstraint(
    "collaborations",
    "unique_playlistId_and_userId",
    'UNIQUE("playlistId", "userId")'
  );

  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.playlistId_playlists.id",
    'FOREIGN KEY("playlistId") REFERENCES playlists(id)'
  );
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.userId_user.id",
    'FOREIGN KEY("userId") REFERENCES users(id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable("collaborations");
};
