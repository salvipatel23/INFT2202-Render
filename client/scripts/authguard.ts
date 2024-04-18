/*
 * Name- Salvi Patel
 * Course Code- INFT 2202-02
 * In Class 4
 * Date: April 17, 2024
 */

"use strict";

(function () {

    // protected routes for contact-list page
    let protected_routes = ["contact-list"];

    // for active link
    if(protected_routes.indexOf(router.ActiveLink) > -1) {
        if (!sessionStorage.getItem("user")) {
            // redirecting to login page
            location.href = "/login";
        }
    }

})();