(function() {
  Vue.component("my-first-component", {
    template: "#my-component",
    props: ["id"],
    data: function() {
      return {
        image: {
          title: "",
          description: "",
          username: "",
          url: ""
        },
        username: "",
        comment: "",
        comments: []
      };
    },
    mounted: function() {
      var me = this;
      axios.get(`/images/${this.id}`).then(function(response) {
        me.image.title = response.data.title;
        me.image.description = response.data.description;
        me.image.url = response.data.url;
        me.image.username = response.data.username;
        me.image.created_at = response.data.created_at;
      }),
        axios.get(`/comment/${this.id}`).then(function(response) {
          var commentData = response.data;

          me.comments = response.data;
        });
    },
    watch: {
      id: function() {
        var me = this;
        axios.get(`/images/${this.id}`).then(function(response) {
          me.image.title = response.data.title;
          me.image.description = response.data.description;
          me.image.url = response.data.url;
          me.image.username = response.data.username;
          me.image.created_at = response.data.created_at;

          if (this.id != imageid) {
            me.$emit("closecomponent");
          }
        }),
          axios.get(`/comment/${this.id}`).then(function(response) {
            var me = this;
            var commentData = response.data;
            console.log("comments array", commentData);
            me.comments = response.data;
            console.log("me.comments pushed in the array", me.comments);
          });
      }
    },
    methods: {
      handleClick: function() {
        this.$emit("message");
      },

      deleteImg: function() {
        var me = this;
        console.log("delete req:", me.id);
        axios
          .post("/delete", {
            imageId: me.id
          })
          .then(function(response) {
            console.log("response POST deleteImg:", response);

            this.id = null;
            location.hash = "";
            location.reload();
          })
          .catch(function(error) {
            console.log("error in POST /delete:", error);
          });
      },

      submitComment: function(e) {
        e.preventDefault();

        var me = this;
        axios
          .post("/comment", {
            userName: this.username,
            userComment: this.comment,
            imgId: this.id
          })
          .then(function(response) {
            var commentData = response.data.success.rows[0];
            console.log("commentData", commentData);
            me.comments.push(commentData);
          });
      }
    }
  });

  new Vue({
    el: "#main",
    data: {
      images: [],
      title: "",
      description: "",
      username: "",
      file: null,
      id: location.hash.slice(1),
      moreButton: true,
      lastId: "",
      lowestId: ""
    },

    mounted: function() {
      var me = this;
      axios
        .get("/images")
        .then(function(response) {
          me.images = response.data;
        })
        .catch(function(err) {});

      addEventListener("hashchange", function() {
        me.id = location.hash.slice(1); // check
      });
    },
    methods: {
      getMoreImages: function() {
        var me = this;
        var lastId = me.images[me.images.length - 1].id;
        console.log("lastId", lastId);
        axios
          .get(`/getMoreImages/${lastId}`)
          .then(function(response) {
            me.images.push.apply(me.images, response.data);
            let = lowestId = me.images[me.images.length - 1].lowestId;

            if (me.lastId == me.lowestId) {
              me.moreButton = null;
            }
          })
          .catch(function(err) {
            console.log("err in GET more images: ", err);
          });
      },

      handleClick: function(e) {
        e.preventDefault();

        console.log("this: ", this);
        var formData = new FormData();
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);
        formData.append("file", this.file);

        var me = this;
        axios
          .post("/upload", formData)
          .then(function(response) {
            me.images.unshift(response.data.result.rows[0]);
          })
          .catch(function(err) {
            console.log("err in POST /upload: ", err);
          });
      },
      handleChange: function(e) {
        this.file = e.target.files[0];
      },
      closecomponent: function() {
        console.log("message received in Vue INSTANCE!!");
        this.id = null;
        location.hash = "";
      },
      toggleComponent: function(imageid) {
        console.log("toggle component");
        console.log("id", imageid);
        this.id = imageid;
      }
    }
  });
})();
