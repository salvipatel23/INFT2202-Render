/*
Name: Salvi Patel
course code: INFT2202-13964
IN Class Exercise - 3
Date: March 16, 2024
*/

"use strict";

(function(){

    /*
     * function capitalizeFirstLetter
     */
    function capitalizeFirstLetter(str:string){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    /**
     * This method is used to bind events to an anchor tag with the data(Custom Tag) attribute value
     * @param link
     */
    function AddLinkEvents(link:string):void {

        /**
         * This will select all the <a>/Anchor tags who have "nav-link" class
         * and a specific "attribute" with specific value.
         */
        let linkQuery = $( `a.nav-link[data=${link}]`);

        /*
            Switch Off Event handlers
         */
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        /**
         * Cascade Style Sheet
         */
        linkQuery.css("text-decoration", "underline")
        linkQuery.css("color", "blue");


        /**
         * Binding and defining the Click event
         */
        linkQuery.on("click", function ()
        {
            /**
             * This method will  dynamically change the content and  navbar
             */
            LoadLink(`${link}`);
        });

        /**
         * Binding CSS Event Hanlders to all the elements
         */
        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font=weight", "bold");
        });

        linkQuery.on("mouseout", function () {
            $(this).css("font=weight", "normal");

        });

    }

    /*
     * This method binds clicks event handler to the "Child Element" of Ul and li tags.
     */
    function AddNavigationEvents():void
    {
        /**
         * Select all the nav links
         */
        let navLinks: JQuery<HTMLElement> = $("ul>li>a");

        navLinks.off("click");
        navLinks.off("mouseover");


        navLinks.on("click", function()
        {
            /**
             *  Explicitly Loading the content for the page
             */
            LoadLink($(this).attr("data") as string)
        });

        /**
         * CSS for the mouse function
         */
        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
        });
    }


    /**
     * This method takes the "data router" as argument as data if possible
     * and then set that link as active link as well as change the "title of the page"
     * @param link
     * @param data
     */
    function LoadLink(link:string, data:string = ""):void
    {
        /**
         * Setting the Active Link for the website
         */
        router.ActiveLink = link;


        AuthGuard();

        /**
         * Sets the active link content
         */
        router.linkData = data;

        /**
         * Manipulating the browser's history stack
         * By Adding a new entry to the browser history.
         */
        history.pushState({}, "", router.ActiveLink);

        /**
         * Changing the title of the page
         */
        document.title = capitalizeFirstLetter(router.ActiveLink);

        /**
         * Make that Nav Link active on which the user is present.
         * using "jquery" {.each()} method to manipulate all the elements specified in the "Element Specifier"
         */
        $("ul>li>a").each(function()
        {
            $(this).removeClass("active");
        });

        /**
         * Select the <a> tag inside the <li> tag which as text content same as Active Title or link !
         */
        $(`li>a:contains(${document.title})`).addClass("active");


        LoadContent();
    }

    /**
     *  Authenticator
     */
    function AuthGuard()
    {
        let protected_routes = ["contactList"];

        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                LoadLink("login");
            }
        }
    }

    /**
     * This function checks login if the "user" item exist in the session storage then the "login" will be changed to
     * "Logout" Button
     */
    function CheckLogin()
    {
        /**
         * Function Execution Indicator
         */
        console.log("login checked")
        /**
         * Tries to get the "user" named item from the session storage
         */
        if(sessionStorage.getItem("user"))
        {
            /**
             * If exists then change the HTML of the login button and converts it into the logout button with new id
             */
            $("#login").html(`<a id="logout" class="nav-link" data="#"><i class="fa fa-sign-out-alt"></i>Logout</a>`)


            /**
             * Once the html of the login button is changed then select that Logout button with the id and bind the event handler to that
             */
            $("#logout").on("click", function ()
            {
                /**
                 * Clear the session storage
                 */
                sessionStorage.clear();

                /**
                 *  changing the html of the logout to login
                 */
                $("#logout").html(`<a class="nav-link" data="login" id="login"><i class="fa fa-sign-in-alt"></i> Login</a>`)

                /**
                 * Load the login page content
                 */
                LoadLink("login");

                /**
                 * Binding the event handler
                 */
                AddNavigationEvents();

            });
        }

    }


    /**
     *This function is used to check whether the user exist in database or not !
     **/
    function  DisplayLoginPage()
    {

        console.log("Called DisplayLoginPage()");

        /**
         * Select the Error Showing Area
         * @type {*|jQuery|HTMLElement}
         */
        let messageArea: any | HTMLElement  = $("#messageArea");

        messageArea.hide(); // Hide initially !


        /**
         * Binding an Event Listener to the login button !
         */
        $("#loginButton").on("click",
            (event) =>
            {

                /**
                 * Default Form Submission Prevention
                 */
                event.preventDefault()
                /**
                 * Conditional Variable !
                 * @type {boolean}
                 */
                let success: boolean = false;

                /**
                 * Creating the instance of User Class
                 * @constructor
                 */
                let newUser: core.User;

                /**
                 * Initialize the new Use Class Object
                 */
                newUser = new core.User();

                /**
                 * Using the Short hand jQuery AJAX GET Request Method
                 */
                $.get("./data/user.json", function(data):void
                {
                    // Assuming that request is successful.
                    for (const user of data.users)
                    {
                        /**
                         * Getting the data from the forms directly
                         */
                        let username:string = document.forms[0].username.value;
                        let password:string = document.forms[0].password.value;

                        /**
                         * Compare the user credentials with the one stored inside the database
                         */
                        if ( username === user.UserName &&  password === user.Password)
                        {
                            /**
                             * Initialize the newUser Object with the data from the json !
                             */
                            newUser.fromJSON(user);
                            /**
                             * Enable the Success Flag !
                             * @type {boolean}
                             */
                            success = true;

                            break; // Move out of loop
                        }
                    }

                    /**
                     * If everything is good
                     */
                    if(success)
                    {
                        // Insert the user into the session storage which will last till the window/tab is open
                        // and will be removed automatically if the user close the tab
                        sessionStorage.setItem("user",<string> newUser.serialize());
                        /**
                         * Remove Warning class and hide the element
                         */
                        messageArea.removeAttr("class").hide();
                        /**
                         * Redirect the user to contact list page !
                         * @type {string}
                         */
                        LoadLink("contact-list")
                    }
                    else
                    {

                        $("#user").trigger("focus").trigger("select");
                        messageArea.addClass("alert alert-danger");
                        messageArea.text("Please Enter Valid Credentials");
                        messageArea.show();
                    }
                });
            }
        )

        /**
         * Binding the event handler to the Cancel Button
         */
        $("#cancelButton").on("click",
            function()
            {
                /**
                 * Reset the form !
                 */
                document.forms[0].reset();
                /**
                 * Redirect the user to index.html
                 * @type {string}
                 */
                LoadLink("home");
            }
        );
    }






    /**
     * Form Validation
     */
    function ContactFormValidation():void
    {
        /**
         * Full Name Validation
         */
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please Enter a Valid Full Name");
        /**
         * Contact Number Validation
         */
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Enter a valid Contact Number")
        /**
         * Email Address Validation
         */
        ValidateField("#email", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please enter a valid email address");


    }

    /**
     * A Function Which will check whether the full name matches the Full name expression or not.
     * Accepts three arguments
     * Field ID
     * regular expression
     * error_message
     */
    function ValidateField(input_field_id: string, regular_expression: RegExp, error_message: String): void
    {
        /**
         * Selecting the Message Area Container !
         * @type {*|jQuery|HTMLElement}
         */
        let messageArea :JQuery<HTMLElement> = $("#messageArea").hide();

        // /**
        //  * Full Name Regular Expression
        //  * @type {RegExp}
        //  */
        // let fullNamePattern = /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/;
        /**
         * When the Full name filed is left then this validation will occur immediately.
         * And using the named function to specifically refer the Name Field cause Named one has it own "this".
         * blur----?
         */
        $(input_field_id).on("blur",function ()
        {
            /**
             * Since used jQuery ,so we have to use the .val() to get the value of the element.
             * @type {*|string|jQuery}
             */
            let inputFieldText:string | number | string[] | undefined = $(this).val(); // this refers to the element on which or the element which triggered this
            // event.

            /**
             * if pattern does not match
             */
            if(!regular_expression.test(<string> inputFieldText))
            {
                /**
                 * Trigger can force the specific event to occur
                 */
                $(this).trigger("focus").trigger("select"); // Appending the two triggers in jquery (Dazy Change function)

                messageArea.addClass("alert alert-danger").text(<string>error_message); // Appending again

                messageArea.show(); // Show the message to the user !
            }
            else
            {
                /**
                 * Do nothing !
                 */
                messageArea.removeAttr("class").hide(); // Remove class and hide the element.
            }
        });
    }
    /**
     * This function insert the new record in the local storage !
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     * @constructor
     */
    function InsertNewRecord(fullName:string, contactNumber:string, emailAddress:string)
    {
        /**
         * Creates the object of the student class !
         */
        let contact = new core.Contact(fullName,contactNumber,emailAddress);

        /**
         * Convert the Object into a JSON String !
         */
        if(contact.serialize())
        {
            /**
             * Build a unique key for the record !
             * @type {string}
             */
            let key: string = contact.fullName.substring(0,1) + Date.now();

            /**
             * Add the element to the local storage !
             */
            localStorage.setItem(key,contact.serialize() as  string);
        }

    }




    /**
     * This function Binds an Event handler with the button
     * Executed on Button Click !
     */
    function DisplayHomePage()
    {
        console.log("Called DisplayHomePage()"); // Prints the message in console.

        // Adding the event listener to the button with the Unique ID
        $("#AboutUsBtn").on("click",
            ()=>
            {
                LoadLink("about");
            })


        /**
         * .append is used in Jquery add the new element as last child element of the selected element.
         */
        $("main").append(`<p id = "MainParagraph" class="mt-3">This is my First Paragraph</p>
                                <article class="container">
                                    <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>
                                </article>`);

    }



    /*
    Function created for Each Page and Executed when the user Goes to that page !
    This function's just print the message according to the page which is loaded !
     */
    function DisplayProductsPage()
    {
        console.log("Called DisplayProductsPage()");
    }

    function DisplayAboutPage(){
        console.log("Called DisplayAboutPage()");
    }

    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage()");
    }

    function DisplayContactPage()
    {
        console.log("Called DisplayContactPage()");

        /**
         * Calling the form validation function not method it is not inside the object or part of the object.
         */
        ContactFormValidation();

        /**
         * Selecting the buttons !
         * @type {HTMLElement}
         */
        let sendButton: HTMLElement = document.getElementById("sendButton") as HTMLElement;

        let subscribeButton: HTMLElement = document.getElementById("subscribe")  as HTMLElement;

        /**
         * Adding an Event listener to button with id sendButton !
         */
        $("#sendButton").on("click",function (event)
        {

            event.preventDefault();

            /**
             * If checkbox is checked !
             */

            let fullName:string = document.forms[0].fullName.value;
            let contactNumber:string = document.forms[0].contactNumber.value;
            let emailAddress:string = document.forms[0].email.value;

            InsertNewRecord(fullName, contactNumber, emailAddress);

            document.forms[0].reset();

            LoadLink("contact-list");



        })

        $("#list").on("click", function()
        {
            LoadLink("contactList");
        })

    }


    /**
     * This function display all the records present inside the local storage
     * and also print the buttons beside the records !
     */
    function DisplayContactListPage():void
    {
        console.log("ContactListPage() Executed");

        /**
         * Checking if the local storage have some records or not !
         */
        if (localStorage.length > 0)
        {
            /**
             * Selecting the table !
             * @type {HTMLElement}
             */
            let contactList : HTMLElement = document.getElementById("contactList") as HTMLElement;

            let data = "";

            let keys = Object.keys(localStorage); // Returns the String Array of Keys present inside the local storage

            /**
             * Initial index !
             * @type {number}
             */
            let index : number = 1;

            for (const key of keys)
            {
                /**
                 * Creating the new Object for each of the record
                 * to make it simple for us to fill the table fields !
                 */
                let contact: core.Contact = new core.Contact();

                /**
                 * As we already have records stored inside the localStorage of the web browser,so we just have to
                 * use the key as Primary key to fetch the records from the storage !
                 * @type {string}
                 */
                let contactData: string= localStorage.getItem(key) as string;

                /**
                 * Once we got record then deserialize it initialize the value of the instance variables.
                 */
                contact.deserialize(contactData as string);

                // Adding the table rows !
                data += `<tr>
                            <!-- Record Number -->
                            <th scope="row" class="text-center">${index}</th>
                            <td>${contact.fullName}</td>
                            <td>${contact.contactNumber}</td>
                            <td>${contact.emailAddress}</td>
                            <!-- Adding the Edit and Delete button beside the Records  -->
                            <td class = "text-center">
                                <!-- Adding a unique value to the Edit button so that it can fetch only that record.-->
                                <button value="${key}" class="btn btn-primary btn-sm edit"><i class="fas fa-dit fa-sm"></i>
                                Edit</button>
                                <!-- Adding a unique value to the Delete button so that it can Delete only that record.-->
                                <button  value="${key}" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt fa-sm"></i>Delete</button>
                            </td>
                            <td></td>
                        </tr>`;

                index++; // Increment by 1
            }

            /**
             * Set the inner html of the contact list.
             * @type {string}
             */
            contactList.innerHTML = data;
        }

        /**
         * When Click event occur then user will be redirected to the
         * edit page where url will have additional information about to process !
         *
         */
        $("#addButton").on("click",
            () =>
            {
                /**
                 * Also adding the additional information to the URL !
                 * @type {string}
                 */
                LoadLink("edit","add");
            }
        )

        /**
         * Delete the record associated with the specific button !
         */
        $("button.delete").on("click", function()
        {
            if(confirm("Please Confirm contact Deletion ?"))
            {
                localStorage.removeItem($(this).val() as string)
            }
            // Redirect the user to the contact list page !
            LoadLink("contact-list");
        })

        /**
         * Redirect the user to the edit page, and url will have additional information to process.
         */
        $("button.edit").on("click", function()
        {
            LoadLink(`edit`, `${$(this).val()}`);
        })
    }

    function  DisplayEditPage()
    {
        console.log("EditPagePage() function invoked !");

        /**
         * Calling the form validation function
         */
        ContactFormValidation();

        /**
         * Getting the part after the hash !
         * @type {string}
         */
        let page : string = router.linkData;

        /**
         * Selecting the Button with id --> editButton.
         * @type {*|jQuery|HTMLElement}
         */
        let button: JQuery<HTMLElement>  = $("#editButton");

        switch (page)
        {
            case "add":

                // Changing the heading of Edit Page to Add Contact !
                $("#editHeading").text("Add Contact");
                // Changing the content of button element
                button.html(`<i class="fas fa-plug-circle fa-sm"></i>Add`);

                /**
                 * Binding the event listener to the button "Add"
                 */
                button.on("click", function (event)
                {
                    // Preventing the default form submission !
                    event.preventDefault();

                    let fullName:string = document.forms[0].fullName.value;
                    let contactNumber:string = document.forms[0].contactNumber.value;
                    let emailAddress:string = document.forms[0].email.value;

                    // Insert the new record into the local Storage
                    InsertNewRecord(fullName , contactNumber, emailAddress);

                    // Redirect the user to contact list page !
                    LoadLink("contact-list");
                });
                break;

            default:
                /**
                 * Default is for the Edit Page
                 */
                /**
                 * Creating the object of contact Class
                 */
                let contact = new core.Contact();
                /**
                 * Getting the Data from the local storage !
                 */
                contact.deserialize(localStorage.getItem(page) as  string);

                /**
                 * Initializing the instance variables !
                 */
                $("#fullName").val(contact.fullName);
                $("#contactNumber").val(contact.contactNumber);
                $("#email").val(contact.emailAddress);

                /**
                 * Binding the event listener to the button Edit !
                 */
                button.on("click", function (event)
                {
                    /**
                     * Preventing the default form submission !
                     */
                    event.preventDefault();
                    /**
                     * Changing the Object value with the new value !
                     * @type {*|string|jQuery}
                     */
                    contact.fullName = <string> $("#fullName").val();
                    contact.contactNumber = <string> $("#contactNumber").val();
                    contact.emailAddress = <string> $("#email").val();

                    /**
                     * Update the record !
                     */
                    localStorage.setItem(page, <string> contact.serialize());
                    /**
                     * Redirect the user to Contact List Page !
                     * @type {string}
                     */
                    LoadLink("contact-list");
                });

                // Cancel the Update of the record
                $("#cancelButton").on("click", function () {
                    LoadLink("contact-list");
                });
                break;
        }

    }

    function DisplayRegisterPage(){
        console.log("Called DisplayRegisterPage");
        AddLinkEvents("login");
    }

    function Display404Page(){
        console.log("Called Display404Page");
    }

    function ActiveLinkCallBack(): Function
    {
        switch (router.ActiveLink)
        {
            case "about": return DisplayAboutPage;
            case "contact" : return  DisplayContactPage;
            case "contactList" : return DisplayContactListPage;
            case "home": return DisplayHomePage;
            case "edit" : return DisplayEditPage;
            case "service" : return DisplayServicesPage;
            case "register" : return DisplayRegisterPage;
            case "login" : return  DisplayLoginPage;
            case "product" : return DisplayProductsPage;
            case "404" : return Display404Page;
            default:
                console.error("ERROR: callback does not exist" + router.ActiveLink);
                return new Function();


        }
    }

    function CapitalizeFirstLetter(str: string)
    {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }





    /**
     * This function append the passed data at the end of the header tag
     */
    function loadHeader()
    {
        $.get("./views/components/header.html", function (html_data)
        {

            /**
             * Append the passed argument to the end of the header or last element/child of the header element.
             */
            $("header").append(html_data);

            document.title = CapitalizeFirstLetter(router.ActiveLink);

            /**
             * This Line of Code will make the icon of that page bold on which the user is currently at !
             */
            $(`li>a:contains(${document.title})`).addClass("active").attr("aria-current","page");


            /**
             * Add the Events to all the <a> anchor tag present inside the immediate child of ul>li>a
             */
            AddNavigationEvents();
            /**
             * Checks the login stuff
             * for the particular pages in the "Protected Pages Array" if the conditions are satisfied.
             */
            CheckLogin();
        });
    }


    /*
     * This function utilize the "activeLink" to load the content according to that !
     */
    function LoadContent():void
    {
        let page_name: string = router.ActiveLink;
        /**
         * Page Necessary Methods Identifiers.
         */
        let callback = ActiveLinkCallBack();

        /**
         * Using the Jquery AJAX shorthand get method to Asynchronously get the data 1
         */
        $.get(`./views/content/${page_name}.html`, function (html_data)
        {

            $("main").html(html_data);

            CheckLogin();
            // Execute the necessary page methods based on the active link.
            callback();
        });

    }


    /**
     *No Changes !
     */
    function  LoadFooter()
    {
        $.get("./views/components/footer.html", function (html_data)
        {
            $("footer").html(html_data);
        })
    }


    /**
     * This Function is executed everyTime when the user/browser load a page.
     * This function specify which method is called when the page is loaded !
     */
    function Start()
    {
        // Start !
        console.log("App Started");

        loadHeader();

        LoadLink("home");

        LoadFooter();


    }
    // Binding the event Listener to the Window Object !
    // When HTML Document including all the stylesheets as well as Images loaded then it will execute the function
    // present inside the executor function.
    window.addEventListener("load", Start);
}()) // Calling the IIFE !;