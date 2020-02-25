

console.log("sanity check");


// (function ()
// {
//     new Vue({
//         el: "#main",
//         data: {
//             cohort: "allspice", /// these properties are reactive
//             name: {
//                 first: "giovanna",
//                 last: "gio"
//             },
//             seen: false,
//             cities: []

//         },
//         mounted: function ()
//         {
//             console.log("my Vue Component has mounted")
//             console.log("this.cities from data:", this.cities)

//             var me = this;
//             axios.get("/cities").then(function (response)
//             {
//                 console.log("response from /cities: ", response);
//                 console.log("response from /cities: ", response.data[0].name);
//                 //this.cities = response.data;
//                 console.log("this.cities", this.cities)
//                 me.cities = response.data;
//             })
//         },
//         methods: {
//             muffin: function (cityName)
//             {
//                 console.log("muffin is running", cityName);
//             }
//         }
//     })

// })();




(function ()
{
    new Vue({
        el: "#main",
        data: {
            images: [], //from axios
            // data properties will store the values of our input fields. Whatever is inside data Vue listen for the change
            title: "",
            description: "",
            username: "",
            file: null

        }, //data ends
        mounted: function ()
        {
            console.log("my Vue Component has mounted")
            //console.log("this.cities from data:", this.cities)

            var me = this;
            axios.get("/images").then(function (response)
            {
                console.log("response from /images: ", response);
                console.log("response from /images: ", response.data[0]);
                console.log("this.images", this.images)

                me.images = response.data;
            })
        },
        methods: {
            handleClick: function (e)
            {
                e.preventDefault();
                console.log("this:", this) //all properties that live inside data
            },
            handleChange: function (e)
            {   // this runs when user selects an image in the input field 
                console.log("handleChange is running ")
                console.log("file: ", e.target.files[0]) // will show the file I selected

                this.file = e.target.files[0]; //this is vue instance.
                console.log("this:", this)


                var formData = new FormData(); //don´t console.log formData. It shows an empty obj
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);


                axios.post("/upload", formData).then(function (resp)
                {
                    console.log("resp from POST /upload: ", resp)
                }).catch(function (err)
                {
                    console.log("err in post /upload", err)
                })
            }


        }

    })

})();



// form dat