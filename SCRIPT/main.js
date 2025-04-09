const app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "../TEMPLATES/homepage.html",
    controller: "homeController",
  })
  .when("/contact", {
    templateUrl : "../TEMPLATES/contact.html",
    controller : "contactController",
  })
  .when("/about", {
    templateUrl : "../TEMPLATES/about.html",
    controller: "aboutController",
  })
  .when("/products", {
    templateUrl : "../TEMPLATES/allProducts.html",
    controller: "productsController",
  })

});

app.service('SharedService', function() {
  var sharedData = {
    viewDescription: false,
    allProducts: [],
    productObject: {}, 
    ceilingFans: [],
    exhaustFans: [],
    wallFans: [],
    pedestalFans:[],
    accessoriesFans:[],
  };

  return sharedData;
});

// Base controller
app.controller('BaseController' ,function($scope, SharedService, $http) {

  $scope.sharedData = SharedService;

  // Display mobile nav onclick
  $scope.toggleButton = false;

  // remove display
  $scope.removeNav = function (){
const mobileNav = document.querySelector('.mobile-navigation')
mobileNav.style.display = 'none'

  }

  // this is for the visit count, the value is stored in the local storage and updated from there

      $scope.counter = parseInt(localStorage.getItem('visit_count')) || 0;
      $scope.counter++;
      localStorage.setItem('visit_count', $scope.counter);


  // Make an API call to update the count
  // const options = {
  //   method: 'GET',
  //   url: 'https://api.api-ninjas.com/v1/counter?id=fanimation123&hit=true',
  //   headers: { 'X-Api-Key': '/BcOXrE3rZkD1vBL7YZjpA==ff77kp3RLiAXJ9xN'},
  //   contentType: 'application/json',
  // }

// console.log('running');
// $http.get('https://api.api-ninjas.com/v1/counter?id=fanimation123&hit=true', options) 
// .then(response => {
//   console.log(response);
//   $scope.counter = response.data.value;
//   console.log('ran');
// })
// .catch(function(error) {
//   console.error('Error updating count:', error);
//   console.log(error);
// });

// time ticker
$scope.timeTicker = function (){

  $scope.currentDate =  new Date()
  document.getElementById('datetime').innerHTML = $scope.currentDate;
return $scope.currentDate;
  // console.log($scope.currentDate);
}

$scope.result ;
// geolocation
navigator.geolocation.getCurrentPosition((coords) =>{
  console.log(coords);
  const latitude = coords.coords.latitude
  const longitude = coords.coords.latitude
  console.log(latitude, longitude);

  $http.get(` https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=a3e8c323fc6a484c94d5dff79a2990ae`)
  .then(response => {
    console.log(response, '=> location');
    $scope.result = response.data.results[0].formatted
    console.log($scope.result);
  })
  .catch( error =>{
    console.error(error);
  });

})

setInterval($scope.timeTicker, 1000)


// toggle descionrion display = block
$scope.toggleBlockDescription = function(id) {
  $scope.sharedData.viewDescription = true;
  // $scope.productId = id;
  // $scope.setProductObject(id);
  console.log($scope.sharedData.allProducts);
  $scope.sharedData.allProducts.forEach(product => {
    if(id === product.product_id){
      $scope.sharedData.productObject = product;
      console.log($scope.sharedData.productObject);
    }
  });
  $scope.productObject =  $scope.sharedData.productObject;
  console.log($scope.productObject);
};
// toggle descionrion display = none
$scope.toggleNoneDescription = function() {
  $scope.sharedData.viewDescription = false;
};

// toggle add to wishlist
$scope.addWishlist = false;

// create variables for product description
// $scope.allProducts = [];
$scope.productObject = {};

// $scope.setProductObject = function (id) {
//   console.log(id);
//   $http.get(`../ASSETS/fans.json`)
// .then(response => {
//   console.log(response, '=> individual product');
//   $scope.sharedData.allProducts = response.data;
//   console.log($scope.sharedData.allProducts);
// })
// .catch( error =>{
//   console.error(error);
// });
// }

// $scope.availableProduct = 6;
$scope.currentValue = 0;

// increase items to add to cart 
$scope.increaseButton = function (availableProduct) {

  if ($scope.currentValue < availableProduct ) {
   $scope.currentValue ++;
  }
  
}
// decrease items to add to cart 
$scope.decreaseButton = function (availableProduct) {

  if ($scope.currentValue > 0) {
    $scope.currentValue --;
  }
 
}


// view review and ratings 
$scope.displayRewiew = false;

$scope.stars = [
  { active: false },
  { active: false },
  { active: false },
  { active: false },
  { active: false }
];

$scope.submitButtonDisabled = true;
    $scope.showSubmitSection = false;
    $scope.message = '';

    $scope.ratingUpdate = function(index) {
      $scope.submitButtonDisabled = false;
      
      if (!$scope.stars[index].active) {
        for (var i = 0; i <= index; i++) {
          $scope.stars[i].active = true;
        }
      } else {
        for (var i = index + 1; i < $scope.stars.length; i++) {
          $scope.stars[i].active = false;
        }
      }
      
      $scope.updateMessage();
    };
    
    $scope.updateMessage = function() {
      var activeElements = $scope.stars.filter(function(star) {
        return star.active;
      });
      
      if (activeElements.length > 0) {
        switch (activeElements.length) {
          case 1:
            $scope.message = 'Terrible';
            break;
          case 2:
            $scope.message = 'Bad';
            break;
          case 3:
            $scope.message = 'Satisfied';
            break;
          case 4:
            $scope.message = 'Good';
            break;
          case 5:
            $scope.message = 'Excellent';
            break;
        }
      } else {
        $scope.message = '';
      }
    };
    
    $scope.submitRating = function() {
      $scope.showSubmitSection = true;
      $scope.submitButtonDisabled = true;
    };
    
    // Initialization
    angular.element(document).ready(function() {
      $scope.submitButtonDisabled = true;
      $scope.showSubmitSection = false;
    });

    $scope.toggleReviewDisplay = function (){
      $scope.displayRewiew = false;
    }

    $http.get('../ASSETS/fans.json')
    .then(response => {
      console.log(response);
      $scope.sharedData.allProducts = response.data;
      console.log($scope.sharedData.allProducts);

  //  ceiling fan homepage view
  $scope.sharedData.allProducts.forEach(product => {
    if (product.product_category === "ceiling fan") {
      $scope.sharedData.ceilingFans.push(product);
    }

});
console.log($scope.sharedData.ceilingFans);
console.log('yasss');

  //  exhaust fan homepage view
  $scope.sharedData.allProducts.forEach(product => {
    if (product.product_category === " EXHAUST FANS") {
      $scope.sharedData.exhaustFans.push(product);
    }

});
console.log($scope.sharedData.exhaustFans);
console.log('yasss');

  //  wall fan homepage view
  $scope.sharedData.allProducts.forEach(product => {
    if (product.product_category === " WALL FANS") {
      $scope.sharedData.wallFans.push(product);
    }

});
console.log($scope.sharedData.wallFans);
console.log('yasss');

  // pedestal fan homepage view
  $scope.sharedData.allProducts.forEach(product => {
    if (product.product_category === "pedestal fan") {
      $scope.sharedData.pedestalFans.push(product);
    }

});
console.log($scope.sharedData.ceilingFans);
console.log('yasss');

  //  accessories fan homepage view
  $scope.sharedData.allProducts.forEach(product => {
    if (product.product_category === " ACCESSORIES") {
      $scope.sharedData.accessoriesFans.push(product);
    }

});
console.log($scope.sharedData.accessoriesFans);
console.log('yasss');

    })
    .catch( error =>{
      console.error(error);
    });


});

//   HOMEPAGE CONTROLLER
app.controller('homeController', function($scope, SharedService) {
  $scope.sharedData = SharedService;

  $scope.toggleDescription = function() {
    $scope.sharedData.viewDescription = !$scope.sharedData.viewDescription;
  };

   // Scroll product list
   $scope.scrollProductList = function(direction, listClass) {
    const productList = document.querySelector('.' + listClass);
    const offsetWidth = productList.offsetWidth;

    if (direction === 'prev') {
      productList.scrollLeft -= offsetWidth;
    } else if (direction === 'next') {
      productList.scrollLeft += offsetWidth;
    }
  
  };

  $scope.scrollProduct = function(direction) {
    const product = document.querySelector('.fans-list2');
    const offsetWidth = product.offsetWidth;

    if (direction === 'prev') {
      $scope.productScroll -= offsetWidth;
    } else if (direction === 'next') {
      $scope.productScroll += offsetWidth;
    }
  };


});


//  ABOUT US CONTROLLER
app.controller('aboutController', ['$scope', function($scope) {
  // Controller logic goes here
  // Use the $scope object to interact with the view
  
  // Example function
  $scope.sayHello = function() {
    $scope.message = 'Hello, World!';
  };
  
  // Example variable
  $scope.count = 0;
}]);

//  CONTACT CONTROLLER
app.controller('contactController', ['$scope', function($scope) {
  // Controller logic goes here
  // Use the $scope object to interact with the view
  
  // Example function
  $scope.sayHello = function() {
    $scope.message = 'Hello, World!';
  };
  
  // Example variable
  $scope.count = 0;
}]);

//  PRODUCTS CONTROLLER
app.controller('productsController', ['$scope', 'SharedService', '$http', function($scope, SharedService, $http) {

  $scope.sharedData = SharedService;

  $scope.products = [];

  $scope.products = $scope.sharedData.allProducts ;


}]);




// OWL CAROUSEL

app.directive('mainCarousel', function() {
  return {
    restrict: 'C',
    link: function(scope, element) {
      $(element).owlCarousel({
        loop: true,
        nav: true,
        navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: false,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 1
          },
          1000: {
            items: 1
          }
        }
      });
    }
  };
});

app.directive('galleriesCarousel', function() {
  return {
    restrict: 'C',
    link: function(scope, element) {
      $(element).owlCarousel({
        loop: true,
        nav: false,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        dots: false,
      });
    }
  };
});
