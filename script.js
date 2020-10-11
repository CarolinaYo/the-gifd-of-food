$(document).ready(function() {


    //=============================================================================
    //---------------JS required for swiper element---------------
    // var swiper = new Swiper('.swiper-container', {
    //     effect: 'coverflow',
    //     grabCursor: true,
    //     centeredSlides: true,
    //     slidesPerView: 'auto',
    //     coverflowEffect: {
    //     rotate: 50,
    //     stretch: 0,
    //     depth: 100,
    //     modifier: 1,
    //     slideShadows: true,
    //     },
    //     pagination: {
    //         el: '.swiper-pagination',
    //     },
    // });
    //=============================================================================



    // ============================================================================
    if (localStorage.getItem('searchedFoodItem') === null) {
        localStorage.setItem('searchedFoodItem', '[]')
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

            let localArray = [];
            response.meals.forEach(meal => {

                let mealName = [meal.strMeal];
                let ingredientsArray = [];

                let recipeObject = {
                    name: meal.strMeal,
                    thumbnail: meal.strMealThumb,
                    instrustion: meal.strInstructions,
                }; 


                for (var i =  1; i  <= 20 ; i++) {

                    let testForIngredients = 'strIngredient' + i;
                    let testForAmount = 'strMeasure' + i
                    let ingredient = '';

                    if ( meal.hasOwnProperty(testForIngredients) && meal[testForIngredients] !== '' && meal[testForIngredients] !== null ) {

                        ingredient = `${meal[testForIngredients]} ${meal[testForAmount]}`
                        ingredientsArray.push(ingredient);
                    }
                }

                recipeObject.ingredients = ingredientsArray
                mealName.push(recipeObject)
                localArray.push(mealName)

            })
            let old_listOfMeals = JSON.parse( localStorage.getItem('listOfMeals') )
            let new_listOfMeals = JSON.stringify(localArray);
            localStorage.setItem('listOfMeals', new_listOfMeals)

            console.log(localArray);

            //================================================================================================
            // -- SET THE LOCAL STORAGE TO THE ARRAY CREATED THAT WAY WHEN YOU CLICK ON AN ITEM YOU CAN TARGET
            //--  THAT ITEM IN THE ARRAY AND DISPLAY THE RECIPE INFO TO THE DOM-------------------------------

            //----------------------------------------THIS WILL BE A FUNCTION OUTSIDE OF API CALL------------------------------------
                //  so you can have an event listener that will will grab that items value based on the text and than search the 
                // local storage object if there is a match than display that matching objects info to the user 
                    // example of an item in local storage array ['meal name', {object containing the recipe info} ] 
                    // if clicked on a list item with the value of 'meal name' capture that value and loop through local 
                    //  storage find a match and than use that objects data to display the correct info 
                    // li on click run fuction that test local storage for that item
                    //  let recipeArray = JSON.parse(localStorage.getItem('storedArray')) 
                    // if (listItems value === recipeArray[0]) {  
                        // display info for recipeArray[1]  which equals the stored data of the recipe for that meal name.
                    //}
            // ----------------------------------------------------------------------------------------------------------------------




            // ================================================================================================
            //------------------put function to display the all the possible meals here.-----------------------
            // a function that will loop through all the items in localArray and display a list to the user

        })
        .then(function() {
            // Get a gify
            let limit = 10;
            $.ajax({
                url:`https://api.giphy.com/v1/gifs/search?api_key=us0J0cVGS2H9LjmcpHGBcqjD2X25FYTg&q=${ mealInput }&limit=${ limit }&offset=0&rating=g&lang=en`,
                method: 'GET'
            }).then(function(gifyResponse){
                // Handle data
                // console.log(gifyResponse);

                // create an array for all the objects in the gifyResponse.data array
                let gifyArray = gifyResponse.data;
                // log to check if I target what I exepected
                // console.log(gifyArray);

                // Calling the function to actully creat the slider
                createSlider(gifyArray)

                // // Updating slider with gify response ¯\_(ツ)_/¯....
                // $('.swiper-slide').each(function( index ){

                //     $(this).css("background-image", "url(" + gifyResponse.data[index].images.original.url + ")");

                //     // console.log(gifyResponse.data[index].images.original.url);
                // })

            })
        })
    }
    getRecipe('soup');
    // =============================================================================


    //===============================================================================
    // -------------- FUNCTION TO UPDATE DOM WITH A SLIDER OF GIFY IMG'S -------------

    // This function takes an array as an argument
    const createSlider = array => {
        let unorderdListItem = $('<ul>');
        unorderdListItem.empty();
        unorderdListItem.addClass('uk-slider-items uk-child-width-1-3@s uk-child-width-1-4@')

        // loops through each array item and create an Img element with the stored url I want to use 
        array.forEach(item => {
            // Creating jquery img element
            let imgEL = $('<img>');
            // Create a list item to append to ul on the dom.
            let listItemEl = $('<li>').css({'width': '200px', 'margin': '2.5px'});
            // create a var to store this array items orginal url 
            let imageUrl = item.images.fixed_width.url
            // check its value to make sure its what I want 
            // console.log(imageUrl);
            // Once I know what what url is set the attr value with stored var and set other styles after 
            imgEL.attr('src', imageUrl).attr('alt', 'funny gif about the food').css({'width': '200px', 'height': '200px'});
            // appends img to the listItem created 
            listItemEl.append(imgEL);
            // Appends the listItem containing the img created all to the ul in the html document.
            unorderdListItem.append(listItemEl);
        })
        $('#gify-slider'). append(unorderdListItem);
    }
    //===============================================================================


    // select input  and get value from it 
    $('Button').on('click',   function(){
        let inputValue = $('INPUT VALUE').val()
        getRecipe(inputValue);


    })

})



