/*
Name: Salvi Patel
course code: INFT2202-13964
IN Class Exercise - 3
Date: March 16, 2024
*/

"use strict";

(function () {

    let protected_routes = ["contact-list"];

    if(protected_routes.indexOf(router.ActiveLink) > -1){
    if(!sessionStorage.getItem("user")) {
        location.href = "/login";
    }
    }

})();