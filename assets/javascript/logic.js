$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC2lAryNx_K6KKAzVKVihZ5JEie983QHt0",
        authDomain: "movie-search-b282f.firebaseapp.com",
        databaseURL: "https://movie-search-b282f.firebaseio.com",
        projectId: "movie-search-b282f",
        storageBucket: "movie-search-b282f.appspot.com",
        messagingSenderId: "248808525127"
    };
    firebase.initializeApp(config);
    var database = firebase.database();

    /* function checkArray(array, searchInput) {
        var hasMovie = array.includes(searchInput);
        return hasMovie;
    } */
    //function to append movies to page
    function appendMovie(response) {
        $(".display").empty();
        var movieTitle = $("<p>").text(response.Title);
        var movieRated = $("<p>").text(response.Rated);
        var movieActors = $("<p>").text(response.Actors);
        var movieGenre = $("<p>").text(response.Genre);
        var moviePlot = $("<p>").text(response.Plot);
        var movieCritic = $("<p>").text(response.Ratings[2].Source);
        var movieCriticRating = $("<p>").text(response.Ratings[2].Value);
        var moviePosterUrl = response.Poster;
        // console.log(movieTitle, movieRated, movieActors, movieCritic, movieCriticRating, moviePlot, moviePosterUrl, movieGenre);
        $("#movie-title").append(movieTitle);
        $("#movie-rated").append(movieRated);
        $("#movie-actors").append(movieActors);
        $("#movie-genre").append(movieGenre);
        $("#movie-plot").append(moviePlot);
        $("#movie-critic").append(movieCritic);
        $("#movie-rating").append(movieCriticRating);
        $("#movie-poster").attr("src", moviePosterUrl);
    };

    //function to add buttons to page
    function addButton(childSnapshot) {
        var databaseTitle = childSnapshot.val().movieTitle;
        var buttonContainer = $("#button-container")
        var newButton = $("<button/>").text(databaseTitle)
            .attr("data-value", databaseTitle)
            .attr("class", "movie-button");

        buttonContainer.append(newButton)
    };

    var movies = []

    $("#add-movie").on("click", function (event) {

        event.preventDefault();


        var searchInput = $("#movie-input").val().trim();

        if (searchInput != "") {

            movies.push(searchInput)

            console.log(movies)

            //checkArray(movies, searchInput);

            //if (hasMovie = false) {

            var url = "https://www.omdbapi.com/";
            url += '?' + $.param({
                //"i": "tt3896198",
                "t": searchInput, //user input search by movie name
                "plot": "short", //returns shortened plot
                "apikey": "adaf8b76" //api-key
            });

            $.ajax({
                url: url,
                method: 'GET',
            }).done(function (response) {
                console.log(response);
                appendMovie(response);
                //addButton(response);
                var firebaseButton = {
                    movieTitle: response.Title,
                    movieRated: response.Rated,
                    movieActors: response.Actors,
                    movieGenre: response.Genre,
                    moviePlot: response.Plot,
                    movieCritic: response.Ratings[2].Source,
                    movieCriticRating: response.Ratings[2].Value
                };
                database.ref(`/${response.Title}`).set(firebaseButton);

            }).fail(function (err) {
                throw err;
            });
            //};
        };//end if statement
        //};

        $("#movie-input").val("")
    });//end first on click

    $(document).on("click", ".movie-button", function (event) {

        var searchInput = $(this).attr("data-value");

        var url = "https://www.omdbapi.com/";
        url += '?' + $.param({
            //"i": "tt3896198",
            "t": searchInput, //user input search by movie name
            "plot": "short", //returns shortened plot
            "apikey": "adaf8b76" //api-key
        });

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function (response) {
            console.log(response);
            appendMovie(response);

        }).fail(function (err) {
            throw err;
        });
    });//end second on click

    database.ref().on("child_added", function (childSnapshot) {
        console.log(childSnapshot);

        //adds button everytime a new movie is added
        addButton(childSnapshot);
    });//end first on child_added
});//end code