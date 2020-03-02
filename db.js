var spicedPg = require("spiced-pg");


var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

exports.getImages = () => {
    return db.query(
        `
        SELECT *, (
            SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId" FROM images
        ORDER BY id DESC
        LIMIT 9
        `
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


exports.getMoreImages = function (lastId) {
    return db
        .query(
            `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1
        ) AS "lowestId" FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10;`,
            [lastId]
        )
        .then(({
            rows
        }) => rows);
};




// exports.getIdImages = function (id) {
//     return db.query(
//         `SELECT *, 
//     (SELECT id
//         FROM images
//         WHERE id < $1
//         ORDER BY id DESC
//         LIMIT 1
//     ) as "prevId",
//     (SELECT id FROM images WHERE id > $1
//         ORDER BY id ASC
//         LIMIT 1)
//         AS "nextId"
//         FROM images WHERE id = $1`,
//         [id]
//     )
// };


exports.deleteImg = function (imageId) {
    return db.query(
        `DELETE FROM images 
        WHERE id = $1
        `,
        [imageId]
    )
}