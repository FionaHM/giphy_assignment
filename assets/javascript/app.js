$('document').ready(function(){
    // set initial topics list
    var topics = ['HERCULE POIROT', 'SHERLOCK HOLMES', 'MISS MARPLE', 'NANCY DREW', 'COLUMBO', 'CAGNEY AND LACEY', 'INSPECTOR CLOUSEAU', 'VERONICA MARS', 'INSPECTOR FROST'];
    var apiKey = 'dc6zaTOxFJmzC'; 
    var responseLimit =  10;  
    var responseRating = 'pg';  // could add radio button for this part
    var queryTerm = '';

    // functions come next
    function buttonHandler(i){
        // adds  buttons for the topics
        var b =  $('<button/>', {
            class: 'newtopic btn btn-primary',
            id: 'button' + i,
            value: topics[i],
            });
        b.attr('data-topic', topics[i]);
        b.html(topics[i]);
        $('#addButtons').append(b);     
        var currentButton = '#button' + i;
    }

    function hasWhiteSpace(string) {
        // replaces spaces in the search term with '+' per API guide
        return string.replace(/\s+/g, '+');
    }

    // Start of Event Handlers
    $('#getGiphyForm').on('reset', function(e){
        // clears images
        $('#displayGiphys').empty();
    })

    // Event handler for submit button to create new topic
    $('#getGiphyForm').on('submit', function(e){
        e.preventDefault(); // stops form reloading page on submit
        // capture user input
        var queryTermRaw = $('#user-input').val().trim(); 
        queryTerm = queryTermRaw.toUpperCase();
        // empty the input box for the next time
        $('#user-input').val('');
        // if nothing entered as user to enter a valid search term
        if (queryTerm === "" ) {
            $('.modal').show();
            $('.modal-body').html('<p> Please enter a valid search term. </p>');
        }
        else if (topics.includes(queryTerm.toUpperCase()))
        {
            // alert("this topic already exists");
            $('.modal').show();
            $('.modal-body').html('<p> This topic already exists. </p>');
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

    // Event handler for the buttons to fetch data from API
    $(document.body).on('click', '.newtopic', function(){
        // set queryTerm depending on the button clicked
        queryTerm = $(this).val();
        // check for spaces and put in "+" instead per API requirements
        var newQueryTerm = hasWhiteSpace(queryTerm);
        var buttonID = $(this).attr('id');
        // remove previous images by emptying div, if there were any there
        $('#displayGiphys').empty();
        // create API query string
        var queryURL = 'http://api.giphy.com/v1/gifs/search?q=' + newQueryTerm + '&api_key=' + apiKey + '&rating='  + responseRating + '&limit=' + responseLimit;
        // use Ajax to access API endpoint and get a response
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
                $('.modal').show();
                $('.modal-body').html('<p> No results avaiable for this topic. </p>');
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

    // onclick event handler for modal close button
    $(document.body).on('click', '.close', function(){
        $('.modal').hide();

    })

    // create buttons for the existing predefined topics
    if (topics.length !== 0 ){
        for (var i = 0; i < topics.length; i++){
            buttonHandler(i);
        }
    } 

});
