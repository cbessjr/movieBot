$(document).ready(function () {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("trailer");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

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
        var movieTrailer = $("<button>").text("Watch " + response.Title + " Trailer")
            .attr("data-value", response.Title)
            .attr("id", "trailer");
        $("#movie-title").append(movieTitle);
        $("#movie-rated").append(movieRated);
        $("#movie-actors").append(movieActors);
        $("#movie-genre").append(movieGenre);
        $("#movie-plot").append(moviePlot);
        $("#movie-critic").append(movieCritic);
        $("#movie-rating").append(movieCriticRating);
        $("#movie-poster").attr("src", moviePosterUrl);
        $("#movie-trailer").append(movieTrailer);
    };

    //function to add buttons to page
    function addButton(childSnapshot) {
        var href = $(this).attr("data-value")
        var databaseRated = childSnapshot.val().movieRated;
        var databaseTitle = childSnapshot.val().movieTitle;
        var buttonContainer = $(".dropdown-item")
        var newButton = $("<li/>").text(databaseTitle)
            .attr("data-rated", databaseRated)
            .attr("data-value", databaseTitle)
            .attr("href", href)
            .attr("class", "movie-button");

        if (databaseRated === "G") {

            $('#g').append(newButton)

        } else if (databaseRated === "PG") {

            $('#pg').append(newButton)

        } else if (databaseRated === "PG-13") {

            $('#pg13').append(newButton)

        } else {

            $('#r').append(newButton)
        }
    };

    $(function () {
        $("#movie-input").autocomplete({
            source: movies
        })
    })

    var movies = [
        "The Godfather",
        "The Shawshank Redemption",
        "Schindler's List",
        "Raging Bull",
        "Casablanca",
        "Citizen Kane",
        "Gone with the Wind",
        "The Wizard of Oz",
        "One Flew Over the Cuckoo's Nest"
    ]

    $("#add-movie").on("click", function (event) {

        event.preventDefault();


        var searchInput = $("#movie-input").val().trim();

        if (searchInput != "") {

            movies.push(searchInput)

            console.log(movies)

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

                //Error handling if movie not found
                if (response.Response != "False") {
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
                }//end error handling if stmnt

            }).fail(function (err) {
                throw err;
            });
        };//end if statement

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

    $(document).on("click", "#trailer", function (event) {
        var modalDiv = $("#modal-content")
        modal.style.display = "block";
        var baseUrl = 'https://www.youtube.com/embed?listType=search&list=';
        var searchField = $(this).attr("data-value") + " trailer";
        var targetUrl = baseUrl + searchField;
        var ifr = $("#iframe").attr("src", targetUrl);

        modalDiv.append(ifr);
    })//end third on click

    span.onclick = function () {
        modal.style.display = "none";
    };//end modal span on click

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }//end window modal on click

});//end code