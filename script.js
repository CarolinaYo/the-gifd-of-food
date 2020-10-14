$(document).ready(function() {


    //=============================================================================
    //---------------JS required for swiper element---------------
    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
        },
    });
    //=============================================================================



    // ==================| SETTING UP LOCAL STORAGE |===============================
    if (localStorage.getItem('activeRecipe') === null) {
        localStorage.setItem('activeRecipe', '[]')
    }
    if (localStorage.getItem('listOfMeals') === null ) {
        localStorage.setItem('listOfMeals', '[]')
    }
    // ============================================================================





    // ==============================================================================
    // ----------------- CREATE A FUNCTION TO DISPLAY SELECTED RECIPE----------------

    // Declare function that takes an argument called recipeObj
        // Inside the function create the elements required to put the container together 
        // Example div.(main-container), img.(img-thumbnail), ul.(contain-ingrentes) p.(instructions)
        // After you create the elements set the requierd values 
        // I will set the data up...
        //  in way that if there is more than one item It will be an array so you can use 
        //  recipeObj.(array-name).forEach(item => { create elemtn and append to parent element})

        // dataStructure for the selected recipe will be an array with two values the name will be array[0]
        // the object containg the recipe inffo will be array[1] so target the values of array[1] in object like form 
        // example store data like let  recipeData = array[1] 
            // let mealTitile = recipeData.name
            // recipeData.name
            // recipeData.thumbnail
            // recipeData.instrustion
            // recipeData.ingredients --- returns an array you will have to loop through each one and update.






    //=============================================================================
    // ---------------------HANDLES API CALL FROM USER INPUT-----------------------
    // Function to get responses from the api based on user input
    const getRecipe = mealInput => {
        // Get a list of recipes
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${ mealInput }`,
            method: 'GET'
        }).then(function(response){

            // Handle data
            console.log(response);

            if (response.meals !== null ){

                $('#meal-item').addClass('uk-form-success')

                let localArray = [];
                response.meals.forEach(meal => {
                    // setting some arrays up to handle data structure to be used later
                    let mealName = [meal.strMeal];
                    let ingredientsArray = [];
    
                    // Creating an object to contain data i want to use later
                    let recipeObject = {
                        name: meal.strMeal,
                        thumbnail: meal.strMealThumb,
                        instrustion: meal.strInstructions,
                    }; 
    
    
                    // loops through all the data properties that conatian ingredients and measerments
                    for (var i =  1; i  <= 20 ; i++) {
                        // creating vars to use a check to see if the contain info or not
                        let testForIngredients = 'strIngredient' + i;
                        let testForAmount = 'strMeasure' + i
                        // var to stor value if its not empty
                        let ingredient = '';
    
                        // checking if the object properties that conatin ingredients have any value.
                        if ( meal.hasOwnProperty(testForIngredients) && meal[testForIngredients] !== '' && meal[testForIngredients] !== null ) {
                            // If they do add them to a var and push that to an array that conatins all the ingredients form other properties
                            ingredient = `${meal[testForIngredients]} ${meal[testForAmount]}`
                            ingredientsArray.push(ingredient);
                        }
                    }
    
                    // after checking al object properties for ingredients push to recipe obj
                    recipeObject.ingredients = ingredientsArray
                    // adding recipies object to mealName array 
                    mealName.push(recipeObject);
                    // pushing all the info for each seperate meal returned into an array that will be used for other events
                    localArray.push(mealName);
    
                })
    
    
                
                //=======================================| DONE |=========================================================
                // -- SET THE LOCAL STORAGE TO THE ARRAY CREATED THAT WAY WHEN YOU CLICK ON AN ITEM YOU CAN TARGET
                //--  THAT ITEM IN THE ARRAY AND DISPLAY THE RECIPE INFO TO THE DOM-------------------------------|DONE
                let old_listOfMeals = JSON.parse( localStorage.getItem('listOfMeals') ) // MAYBE not useful here but in the function to loop through list items on the dom
                let new_listOfMeals = JSON.stringify(localArray);
                localStorage.setItem('listOfMeals', new_listOfMeals);
    
                console.log(localArray);
    
    
                //===================| CALL FUNCTION HERE TO DISPLAY ALL ITEMS RECIVED FROM AJAX CALL  | ====================
                //------------------put function to display the all the possible meals here.-----------------------
                // a function that will loop through all the items in localArray and display a list to the user
                // =======================================| PSEUDO CODE BELOW |==============================================
                
                localArray.forEach(item => {
                    let parentDivEl = $('<div>').addClass('uk-flex-middle uk-grid recipe-div');
                    let childDivNameEl = $('<div>').addClass('uk-width-2-3@m');
                    let childDivImageEl = $('<div>').addClass('uk-width-1-3@m uk-flex-first');
                    let thumbnailImageEl = $('<img>').css({'width': '50px', 'height': '50px'});
                    let mealNamParagraghEl = $('<p>').addClass('uk-text-lead')

                    let mealName = item[0];
                    let mealThumbnail = item[1].thumbnail;

                    console.log(mealName, mealThumbnail);
                    mealNamParagraghEl.text(mealName);
                    thumbnailImageEl.attr('src', mealThumbnail);
                    childDivImageEl.append(thumbnailImageEl);
                    childDivNameEl.append(mealNamParagraghEl);
                    parentDivEl.append(childDivNameEl,childDivImageEl);

                    $('#meal-list').append(parentDivEl,$('<hr>'));



                })
                 
                //----------------------------------------THIS FUNCTION WILL BE BUILT OUTSIDE OF API CALL------------------------------------
                    //  Need a function handle displaying all the items in the array built above 
                        // example of an item in the array ['meal name', {object containing the recipe info} ] 
                        // display the name like in the example as shown above the recipes meal name would be... 'meal name'
                        // you can also add other data too like thumbnal if you choose
                        // storage array containg all the items from the ajax call then loop through until you find a match and 
                        // than use that objects data to display the correct  recipe info 
                            // like an event to be clicked on later to run a fuction that test local storage for that item
                            //_________________________________________________________________________________________
                            //   ---- Below is an example of why we deal with the data the way we are-----------
                                // in the next function to actually display the recipe info......
                                //  let recipeArray = JSON.parse(localStorage.getItem('storedArray')) 
                                // inside of a for loop or forEach() function loop through get right data
                                // if (listItems value === recipeArray[0]) {  
                                    // display info for recipeArray[1]  which equals the stored data of the recipe for that meal name.
                                //}
                                    // than handle all the required code to create elements and update the DOM
                // ----------------------------------------------------------------------------------------------------------------------
    
            }  else if ($('#meal-item').hasClass('uk-form-success')){
                $('#meal-item').removeClass('uk-form-success');
                $('#meal-item').addClass('uk-form-danger');
            }


        })
        .then(function() {
            // Get a gify
            let limit = 10;
            $.ajax({
                url:`https://api.giphy.com/v1/gifs/search?api_key=us0J0cVGS2H9LjmcpHGBcqjD2X25FYTg&q=${ mealInput }&limit=${ limit }&offset=0&rating=g&lang=en`,
                method: 'GET'
            }).then(function(gifyResponse){
                // Handle data
                console.log(gifyResponse);

                // create an array for all the objects in the gifyResponse.data array
                let gifyArray = gifyResponse.data;
                // log to check if I target what I exepected
                // console.log(gifyArray);

                // _________________________________________________________| UK SLIDER FUNCTION CALL |____________
                // Calling the function to actully create the slider
                // createSlider(gifyArray)

                // // Updating slider with gify response ¯\_(ツ)_/¯....
                $('.swiper-slide').each(function( index ){

                    $(this).css("background-image", "url(" + gifyResponse.data[index].images.original.url + ")");

                    // console.log(gifyResponse.data[index].images.original.url);
                })

            })
        })
    }
    // getRecipe('soup');
    // =============================================================================








    //==========================| CREAT UK SLIDER |=====================================================
    // -------------- FUNCTION TO UPDATE DOM WITH A SLIDER OF GIFY IMG'S -------------

    // This function takes an array as an argument
    // const createSlider = array => {
    //     // Setting up 
    //     let unorderdListItem = $('<ul>');
    //     $('#gify-slider').empty();
    //     unorderdListItem.addClass('uk-slider-items uk-child-width-1-3@s uk-child-width-1-4@')

    //     // loops through each array item and create an Img element with the stored url I want to use 
    //     array.forEach(item => {
    //         // Creating jquery img element
    //         let imgEL = $('<img>');
    //         // Create a list item to append to ul on the dom.
    //         let listItemEl = $('<li>').css({'width': '200px', 'margin': '2.5px'});
    //         // create a var to store this array items orginal url 
    //         let imageUrl = item.images.fixed_width.url
    //         // check its value to make sure its what I want 
    //         // console.log(imageUrl);
    //         // Once I know what what url is set the attr value with stored var and set other styles after 
    //         imgEL.attr('src', imageUrl).attr('alt', 'funny gif about the food').css({'width': '200px', 'height': '200px'});
    //         // appends img to the listItem created 
    //         listItemEl.append(imgEL);
    //         // Appends the listItem containing the img created all to the ul in the html document.
    //         unorderdListItem.append(listItemEl);
    //     })
    //     $('#gify-slider').append(unorderdListItem);
    // }
    //===============================================================================

  




//----------------EXAMPLE OF THE EVENT HANDLER FUNCTION FOR GETTING A RECIPE--------------
    // select input  and get value from it 
    $('#searchBtn').on('click',   function(event){
        event.preventDefault();
        let inputValue = $('#meal-item').val();

        console.log(inputValue);
        getRecipe(inputValue);

        $('.swiper-container').css('visibility', 'visible');
        $('#meal-container').css('display', 'block');
        $('#meal-list').empty();


    })

})

$('#meal-container').on('click', 'div.recipe-div', function() {
    let mealText = $(this).text();

    console.log(mealText);
    console.log('-----');

    let recipeArray = JSON.parse(localStorage.getItem('listOfMeals'));
    let recipeToStore =  JSON.parse(localStorage.getItem('activeRecipe'))

    recipeArray.forEach(recipe => {
        if (mealText === recipe[0] ) {

            console.log(recipe[1]);
            
            
            recipeToStore = recipe;
            
        }
    })
    localStorage.setItem( 'activeRecipe', JSON.stringify(recipeToStore) );
    
})


