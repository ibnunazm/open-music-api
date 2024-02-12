exports.up = (pgm) => {
  pgm.createTable("playlists", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: false,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
  pgm.addConstraint(
    "playlists",
    "fk_playlists.owner_users_id",
    "FOREIGN KEY(owner) REFERENCES users(id)"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("playlists", "unique_name_and_owner", { ifExists: true });
  pgm.dropTable("playlists");
};
