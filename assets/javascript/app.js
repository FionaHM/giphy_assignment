$('document').ready(function(){
    // set initial topics list
    var topics = ['poirot', 'sherlock holmes', 'miss marple', 'ironside', 'colombo', 'cagney and lacey', 'mary', 'mike', 'jane', 'mary', 'mike', 'jane', 'mary', 'mike', 'jane', 'mary', 'mike', 'jane', ];
    var apiKey = 'dc6zaTOxFJmzC'; 
    var responseLimit =  12;  
    var responseRating = 'pg';  // could add radio button for this part
    var queryTerm = '';

    // create buttons for the existing predefined topics
    if (topics.length !== 0 ){
        for (var i = 0; i < topics.length; i++){
            buttonHandler(i);
        }
    } 

    function buttonHandler(i){
        // for (var i = 0; i < length; i++){
        var b =  $('<button/>', {
            class: 'newtopic btn btn-primary',
            id: 'button' + i,
            value: topics[i],
            });
        b.attr('data-topic', topics[i]);
        b.html(topics[i]);
        $('#addButtons').append(b);     

        var currentButton = '#button' + i

    }

    function hasWhiteSpace(string) {
        // return /\s/g.test(s);
        // console.log(string.replace(/ /g, '+'));
        return string.replace(/\s+/g, '+');
    }

    // Event Handlers
    // Clears Images
    $('#getGiphyForm').on('reset', function(e){
             $('#displayGiphys').empty();
    })
    // submits new topic
    $('#getGiphyForm').on('submit', function(e){
        // get all the inputs into an array.
        e.preventDefault(); // stops form reloading page on submit
        // capture user input
        queryTerm = $('#user-input').val().trim(); 
        // empty the input box
        $('#user-input').val('');
        // if nothing entered as user to enter a valid search term
        if (queryTerm === "" ) {
            alert("please enter a valid search term");
        }
        else if (topics.includes(queryTerm))
        {
            alert("this topic already exists");
        }  // check if topic  already there
        else
        {
            // add user-input to topics array
            topics.push(queryTerm);
            // create buttons from values in "topics" array and add to page
            if (topics.length !== 0 ){
                // add buttons
                buttonHandler(topics.length-1);
            }
        }
    });
    // onclick event handler for the new buttons
    $(document.body).on('click', '.newtopic', function(){
        // set query term depending on the button clicked
        queryTerm = $(this).val();
        // check for spaces and put in "+"
        var newQueryTerm = hasWhiteSpace(queryTerm);
        var buttonID = $(this).attr('id');
        // remove previous images by emptying div, if there were any there
        $('#displayGiphys').empty();
        // create API query string
        var queryURL = 'http://api.giphy.com/v1/gifs/search?q=' + newQueryTerm + '&api_key=' + apiKey + '&rating='  + responseRating + '&limit=' + responseLimit;
        // use ajax to access API endpoint and get a response
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .done(function(response) {  
            // create a new image tab for this  if there are results
            if (response.data.length !== 0 ){
                for (var i=0; i < response.data.length; i++ ){
                    var imageID = '#image' + i;
                    var e = $('<div class="image-plus-rating text-center">');
                    var d = $('<p class="image-rating"> Rating: '+ response.data[i].rating + '</p>');
                    var c =  $('<img/>', {
                            class: 'newimage',
                            id: 'image' + i,
                            src: response.data[i].images.fixed_height_still.url,
                            alt: queryTerm,
                            'data-still': response.data[i].images.fixed_height_still.url,
                            'data-animate': response.data[i].images.fixed_height.url,
                            });
                   
                    // $('#displayGiphys').append(d);
                    // $('#displayGiphys').append(c);
                    $(e).append(d);
                    $(e).append(c);
                    $('#displayGiphys').append(e);

                    // set the state using the data method - if I put in the above var c
                    // the data state changes on the DOM but not in javacript - it just uses the initial state
                    // stackoverflow says it is to do with how javascript stores the data values and you must set it the same way you get it
                    $(imageID).data('state','still');
                }

            } 
            else{
                // tell user no results
                alert("No results for this topic");
                // remove button
                $('#' + buttonID).remove();
            }
        });
    }); 

    // onclick event handler for images
    $(document.body).on('click', '.newimage', function(){
        // check the current state and change it
        if ($(this).data('state') === 'still'){
            //change the state from still to animate
            $(this).data('state','animate');
            $(this).attr('src', $(this).data('animate'));
        } 
        else if ($(this).data('state') === 'animate'){
            //change the state from animate to still
            $(this).data('state', 'still');
            $(this).attr('src', $(this).data('still'));
        }
    }); 
});
