$('document').ready(function(){
    
    var topics = [''];
    var apiKey = 'dc6zaTOxFJmzC';
    var queryTerm = 'animal'; //change 
    var responseLimit =  10;
    var responseRating = "pg, pg-13";
    var queryURL = 'http://api.giphy.com/v1/gifs/search?q='+ queryTerm +'&api_key=' + apiKey + '&rating' + responseRating + '&limit' + responseLimit;

    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .done(function(response) {
        console.log(response);
       
    });

});