const express = require("express");
const app = express();
const s3 = require("./s3.js")
const s3Url = require("./config.json");
//this serves all html/css/front end js

app.use(express.static("public"));
app.use(express.json())
const db = require("./db");

/// FILE UPLOAD BOILERPLATE CODE ---do not touch
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//// FILE UPLOAD BOILERPLATE CODE ---do not touch



app.get("/images", (req, res) => {
    //console.log("GET request for /images ");
    db.getImages()
        .then(result => {
            // console.log("ImageData: " + JSON.stringify(result));
            const images = result.rows;
            res.json(images);
        })
        .catch(function (err) {
            console.log("error in get images: ", err);
        });
});


app.get("/images/:id", (req, res) => {
    console.log("GET request for /images:id ");
    console.log("req.params", req.params);
    db.getIdImages(req.params.id)
        .then(result => {
            console.log(result)
            imageData = result.rows[0];
            console.log("imageData", imageData);
            res.json(imageData);
        })
        .catch(function (err) {
            console.log("error in get images:id ", err);
        });
});



app.get("/comment/:id", (req, res) => {
    console.log("get request for comments")
    db.getComment(req.params.id).then(result => {
            console.log("result.rows from comment/:id ", result.rows)
            commentData = result.rows;
            console.log("commentData", commentData);
            res.json(commentData);
        })
        .catch(function (err) {
            console.log("error in get comment:id ", err);
        });
})



app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("input ", req.body);
    console.log("file ", req.file);
    console.log("POST request for /upload ");
    let url = "https://s3.amazonaws.com/francybucket/" + req.file.filename;
    let title = req.body.title;
    let description = req.body.description;
    let username = req.body.username;


    if (req.file) {

        db.insertImages(url, title, description, username).then(result => {
            console.log("result in post upload", result)
            res.json({
                success: true,
                result
            });

        }).catch(function (err) {
            console.log("error in post upload", err)
        })

    } else {
        res.json({
            success: false
        })
    }
})

app.post("/comment", (req, res) => {
    console.log("req.body.userComment", req.body.userComment);
    console.log("req.body.userName", req.body.userName);
    console.log("req.body.imgId", req.body.imgId);
    let username = req.body.userName;
    let comment = req.body.userComment;
    let imgId = req.body.imgId;

    db.insertComment(imgId, username, comment).then(result => {
        console.log("result in POST /comment", result)
        res.json({
            success: result
        });
    }).catch(function (err) {
        console.log("error in comment upload", err)
    })

   
})


app.get('/getMoreImages/:id', (req, res) => {
    console.log('params', req.params.id)
    //this is going to be hooked up with the database
    db.getMoreImages(req.params.id).then(response => {
        console.log("getMoreImages response", response)
        res.json(response)
    });
});


app.post("/delete", s3.deleteImage, (req, res) => {

    const {
        imageId
    } = req.body;
    db.deleteImg(imageId)
        .then(() => {
            console.log("deleteImage psql successfull");
            res.json({
                imageId: imageId
            });
        })
        .catch(error => {
            console.log("error in deleteImage", error);
        });
});


app.listen(8080, () => console.log("imageboard!"))