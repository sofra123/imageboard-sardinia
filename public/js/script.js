(function () {
    Vue.component("my-first-component", {
        template: "#my-component",
        props: ["id"],
        data: function () {
            return {
                image: {
                    title: "",
                    description: "",
                    username: "",
                    url: ""
                },
                //rendering the comments 
                username: "",
                comment: "",
                comments: []
            };
        },
        mounted: function () {
            var me = this;
            console.log("this id before axios ", this.id);
            // get the id of the image
            axios.get(`/images/${this.id}`).then(function (response) {
                    console.log("response from /images+id: ", response.data);
                    console.log("this id after axios ", me.id);

                    me.image.title = response.data.title;
                    me.image.description = response.data.description;
                    me.image.url = response.data.url;
                    me.image.username = response.data.username;
                    // me.image.images.push(response.data); non serve
                }),
                //console.log("this: ", this);

                // this.id = 9 -- NOT ALLOWED!!!
                axios.get(`/comment/${this.id}`).then(function (response) {
                    console.log("axios.get comments all response", response);
                    console.log("response data from axios.get comments", response.data);

                    //me.image.comment = response.data.comment;
                    //me.image.username = response.data.username;
                    var commentData = response.data
                    console.log("comments array", commentData)
                    //me.comments.push(commentData);
                    me.comments = response.data // we don´t want to push an array in an array 
                    console.log("me.comments pushed in the array", me.comments)
                })
        },
        watch: { //watches for props changing
            id: function () {
                console.log("the id has changed", this.id)

                axios.get(`/images/${this.id}`).then(function (response) {
                        console.log("response from /images+id: ", response.data);
                        console.log("this id after axios ", me.id);

                        me.image.title = response.data.title;
                        me.image.description = response.data.description;
                        me.image.url = response.data.url;
                        me.image.username = response.data.username;
                        // me.image.images.push(response.data); non serve
                    }),
                    //console.log("this: ", this);

                    // this.id = 9 -- NOT ALLOWED!!!
                    axios.get(`/comment/${this.id}`).then(function (response) {
                        console.log("axios.get comments all response", response);
                        console.log("response data from axios.get comments", response.data);

                        //me.image.comment = response.data.comment;
                        //me.image.username = response.data.username;
                        var commentData = response.data
                        console.log("comments array", commentData)
                        //me.comments.push(commentData);
                        me.comments = response.data // we don´t want to push an array in an array 
                        console.log("me.comments pushed in the array", me.comments)
                    })

                /// we want to do the same thinh as we did in mountain 
            }
        },
        methods: {
            handleClick: function () {
                this.$emit("message");
            },
            submitComment: function (e) {
                e.preventDefault();

                var me = this;
                axios.post("/comment", {
                    userName: this.username,
                    userComment: this.comment,
                    imgId: this.id
                }).then(function (response) {
                    // var username = this.username;
                    // this.comments = response.comments;

                    var commentData = response.data.success.rows[0];
                    console.log("commentData", commentData)
                    me.comments.push(commentData);
                })

            }
        }
    }); // closes Vue component

    new Vue({
        el: "#main",
        data: {
            images: [

            ], //from axios
            // data properties will store the values of our input fields. Whatever is inside data Vue listen for the change
            title: "",
            description: "",
            username: "",
            file: null,
            id: location.hash.slice(1),
            moreButton: true
        }, //data ends

        mounted: function () {
            console.log("my Vue Component has mounted")
            var me = this;
            axios.get("/images").then(function (response) {
                console.log("response from /images: ", response);
                console.log("response from /images: ", response.data[0]);
                console.log("this.images", this.images);

                me.images = response.data;
            }).catch(function (err) {
                console.log('err in GET /images: ', err);
            });


            addEventListener("hashchange", function () {
                me.id = location.hash.slice(1); // check
            })
        },
        methods: {


            getMoreImages: function () {
                console.log("get more images function")
                var me = this;
                var lastId = me.images[me.images.length - 1].id
                console.log("lastId", lastId)
                axios.post("/get-more-images", {
                    id: lastId
                }).then(function (response) {
                    console.log("axios get more images")
                    console.log("response data from getMoreImages", response)
                    //me.images.push.apply();
                }).catch(function (err) {
                    console.log('err in GET more images: ', err);
                });

            },


            handleClick: function (e) {
                e.preventDefault();
                // 'this' allows me to see all the properties of data
                console.log('this: ', this);

                // we NEED to use FormData to send a file to the server
                var formData = new FormData();
                formData.append('title', this.title);
                formData.append('description', this.description);
                formData.append('username', this.username);
                formData.append('file', this.file);

                var me = this;
                axios.post('/upload', formData).then(function (response) {
                    console.log('resp from POST /upload: ', response.data.result.rows[0]);
                    me.images.unshift(response.data.result.rows[0]);
                }).catch(function (err) {
                    console.log('err in POST /upload: ', err);
                });
            },
            handleChange: function (e) {
                // console.log('handleChange is running');
                // console.log('file:', e.target.files[0]);
                this.file = e.target.files[0];
            },
            closeComponent: function () {
                console.log("message received in Vue INSTANCE!!");
                if (this.id) {
                    return (this.id = null)
                        (location.hash = "");

                } else {
                    this.id = imageid
                }
            },
            toggleComponent: function (imageid) {
                console.log("toggle component")
                console.log('id', imageid);
                this.id = imageid
            },


        }

    }) // closes Vue instance 

})();