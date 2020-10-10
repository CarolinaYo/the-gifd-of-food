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



// ============================================================================
if (localStorage.getItem('searchedFoodItem') === null) {
    localStorage.setItem('searchedFoodItem', [])
}



// ============================================================================





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

        }).then(function() {
            // Get a gify
            let limit = 10;
            $.ajax({
                url:`https://api.giphy.com/v1/gifs/search?api_key=us0J0cVGS2H9LjmcpHGBcqjD2X25FYTg&q=${ mealInput }&limit=${ limit }&offset=0&rating=g&lang=en`,
                method: 'GET'
            }).then(function(gifyResponse){
                // Handle data
                console.log(gifyResponse);

                // Updating slider with gify response ¯\_(ツ)_/¯....
                $('.swiper-slide').each(function( index ){

                    $(this).css("background-image", "url(" + gifyResponse.data[index].images.original.url + ")");


                    // console.log(gifyResponse.data[index].images.original.url);
                })

            })
        })
    }
getRecipe('salad');
// =============================================================================


// const get



// select input  and get value from it 
$('Button').on('click',   function(){
    let inputValue = $('INPUT VALUE').val()
    getRecipe(inputValue);


})

})



