const express = require("express");
const app = express();

//this serves all html/css/front end js

app.use(express.static("public"));

// any routes are just for info/data...
// app.get("/cities", (req, res) =>
// {
//     console.log("I am the get route for cities");
//     const cities = [
//         {
//             name: "Berlin",
//             country: "Germany"
//         },
//         {
//             name: "Guayaquil",
//             country: "Equador"

//         },
//         {
//             name: "Kinross",
//             country: "Scotland!!!"
//         }
//     ];
//     // we will be using res.json a lot!
//     res.json(cities)
// });



const db = require("./db");

/// FILE UPLOAD BOILERPLATE CODE ---do not touch
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback)
    {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback)
    {
        uidSafe(24).then(function (uid)
        {
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



app.get("/images", (req, res) =>
{
    console.log("GET request for /images ");
    db.getImages()
        .then(result =>
        {
            console.log(result)
            const images = result.rows;
            res.json(images);
        })
        .catch(function (err)
        {
            console.log("error in get images: ", err);
        });
});

app.post("/upload", uploader.single("file"), (req, res) =>
{
    console.log("input ", req.body);
    console.log("file ", req.file);
    console.log("POST request for /upload ");


    if (req.file) {
        res.json({
            success: true
        });

    } else {
        res.json({
            success: false
        })
    }
})



app.listen(8080, () => console.log("imageboard!"))

