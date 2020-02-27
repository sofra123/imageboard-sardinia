var spicedPg = require("spiced-pg");


var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = () => {
    return db.query(
        `SELECT * FROM images
        ORDER BY created_at DESC
        LIMIT 10`
    );
};



exports.insertImages = (url, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username)
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, title, description, username]
    );
};

exports.insertComment = (image_id, username, comment) => {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3) RETURNING *`,
        [username, comment, image_id]
    );
};

exports.getIdImages = (id) => {
    return db.query(
        `SELECT * FROM images WHERE id = $1`,
        [id]
    );
};


exports.getComment = (id) => {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1`,
        [id]

    )
}



exports.getMoreImages = lastId => db.query(
    `SELECT *, (
        SELECT id AS lastId  FROM images
        WHERE id = $1
        ORDER BY id DESC
    )
FROM images
WHERE id < $1
ORDER BY id DESC
LIMIT 4`,
    [lastId]
).then(
    ({
        rows
    }) => rows
);