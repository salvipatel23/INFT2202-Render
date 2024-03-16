"use strict";

//IIFE - Immediately Invoked Functional Expression
(function () {

    function AddLinkEvents(link:string):void {

        //find all anchor tags with the class link that also has a data attribute equal to our link arg
        let linkQuery = $('a.link[data=${link}]');

        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");

        linkQuery.css("text-decoration", "underline")
        linkQuery.css("color", "blue");

        linkQuery.on("click", function () {
            LoadLink('${link}');
        });

        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font=weight", "bold");
        });

        linkQuery.on("mouseout", function () {
            $(this).css("font=weight", "normal");

        });

    }
    function AddNavigationEvents():void {
        let navLinks = $("ul>li>a") // find all navigation link

        navLinks.off("click");
        navLinks.off("mouseover");

        navLinks.on("click", function(){
            LoadLink($(this).attr("data") as string)
        });

        navLinks.on("mouseover", function(){
            $(this).css("cursor", "pointer");
    });
    }
    function LoadLink(link:string, data:string = ""):void {
        router.ActiveLink = link;

        AuthGuard();
        router.linkData = data;

        history.pushState({}, "", router.ActiveLink);

        document.title = capitalizeFirstLetter(router.ActiveLink);

        $("ul>li>a").each(function(){
            $(this).removeClass("active");
    });

        $('li>a>:contains(${document.title})').addClass("active");

        LoadContent();

    }
    function AuthGuard()
    {
        let protected_routes = ["contact-list"];

        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                location.href = "/login";
            }
        }
    }

    function CheckLogin(){

        console.log("login checked")
        if(sessionStorage.getItem("user")){
            $("#login").html(`<a id="logout" class="nav-link" data="#"><i class="fa fa-sign-out-alt"></i> Logout</a>`)

        }
        $("#logout").on("click", function (){
           sessionStorage.clear();

            $("#login").html(`<a class="nav-link" data="login"><i class="fa fa-sign-in-alt"></i> Login</a>`)

            AddNavigationEvents();

            LoadLink("login");
        });
    }


    /*function AjaxRequest(method:string, url:string, callback:Function){

        //Step1: instantiate new XHR object
        let xhr = new XMLHttpRequest();

        //Step2: open XHR request
        xhr.open(method, url);

        //Step4: Add event listener for the readystatechange event
        // the readystatechange event is triggered when the state of a document being fetched changes
        xhr.addEventListener("readystatechange", () => {

            if(xhr.readyState === 4 && xhr.status === 200){

                if(typeof callback == "function"){
                    callback(xhr.responseText);
                }else{
                    console.error("ERROR: callback not a function");
                }
            }
        });

        //Step3: send XHR Request
        xhr.send();
    }*/
    function ContactFormValidation(){

        //fullName
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "Please enter a valid full name");

        //contactNumber
        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "Please enter a valid contact number");

        //emailAddress
        ValidateField("#emailAddress",
            /^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/,
            "Please enter a valid email address");
    }
    /**
     * Validate form fields provided by users
     * @param input_field_id
     * @param regular_expression
     * @param error_message
     */
    function ValidateField(input_field_id:string, regular_expression:RegExp, error_message:string ){

        let messageArea =$("#messageArea").hide();

        $(input_field_id).on("blur", function (){

            let inputFieldText = $(this).val() as string;

            if(!regular_expression.test(inputFieldText)){
                //full name does not success Pattern Matching
                $(this).trigger("focus"). trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();

            } else{
                //fullName is successful
                messageArea.removeAttr("class").hide();

            }


        });
    }

    /**
     * Add contact to localStorage
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     * @constructor
     */
    function AddContact(fullName:string, contactNumber:string, emailAddress:string){
        let contact = new core.Contact(fullName, contactNumber, emailAddress)
        if(contact.serialize()){
            let key = contact.fullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize() as string);
        }
    }
    function DisplayHomePage(){
        console.log("Called DisplayHomePage()");

        $("#AboutUsBtn").on("click", () => {
            LoadLink("about");
        });

        $("main").append(`<p id="MainParagraph" class="mt-3">This is the first Paragraph</p>`);

        $("main").append(`<article class="container"><p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`);


    }
    function DisplayProductsPage(){
        console.log("Called DisplayProductsPage");
    }
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage");
    }
    function DisplayAboutUsPage(){
        console.log("Called DisplayAboutUsPage");
    }
    function DisplayContactUsPage(){
        console.log("Called DisplayContactUsPage");

        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function(){
            LoadLink("contact-list");
        });

        ContactFormValidation();

        let sendButton = document.getElementById("sendButton") as HTMLElement;
        let subscribeButton = document.getElementById("subscribeCheckbox") as HTMLInputElement;

        sendButton.addEventListener("click", function(){
            if(subscribeButton.checked){

                let fullName:string = document.forms[0].fullName.value;
                let contactNumber:string = document.forms[0].contactNumber.value;
                let emailAddress:string = document.forms[0].emailAddress.value;

                AddContact(fullName, contactNumber, emailAddress);

                /*let contact = new core.Contact(fullName, contactNumber, emailAddress);
                if(contact.serialize() as string){
                    let key = contact.fullName.substring(0,1) + Date.now();
                    localStorage.setItem(key, contact.serialize() as string)
                }*/
            }
        });
    }
    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");

        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList") as HTMLElement;
            let data = "";

            let keys = Object.keys(localStorage);

            let index = 1;
            for (const key of keys) {
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key) as string;
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                            <td>${contact.fullName}</td>
                            <td>${contact.emailAddress}</td>
                            <td>${contact.contactNumber}</td>
                            <td class="text-center">
                                <button value="${key}" class="btn btn-primary btn-sm edit">
                                    <i class="fas fa-edit fa-sm">&nbsp;Edit</i>
                                </button>
                            </td>
                            <td>
                                <button value="${key}" class="btn btn-danger btn-sm delete">
                                    <i class="fas fa-trash-alt fa-sm">&nbsp;Delete</i>
                                </button>
                            </td>
                        </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("#addButton").on("click", () => {
            location.href = "/edit#add"
            LoadLink("edit", "add");
        });

        $("button.delete").on("click", function()  {
            if(confirm("Please confirm contact deletion")){
                localStorage.removeItem($(this).val() as string)
            }
           // location.href = "/contact-list";
            LoadLink("contact-list");
        });

        $("button.edit").on("click", function()  {
            // location.href = "/edit" + $(this).val();

            LoadLink("edit", $(this).val() as string);
        });
    }

        function DisplayEditPage(){
            console.log("Called DisplayEditPage()");

            let page = location.hash.substring(1);

            switch (page){
                case "add":

                    $("main>h1").text("Add Contact");
                    $("#editButton").html(`<i class="fas fa-plu-circle fa-sm"/> Add`)

                    $("#editButton").on("click", (event) => {

                        event.preventDefault();

                        let fullName:string = document.forms[0].fullName.value;
                        let contactNumber:string = document.forms[0].contactNumber.value;
                        let emailAddress:string = document.forms[0].emailAddress.value;

                        AddContact(fullName, contactNumber, emailAddress);
                      //  location.href = "/contact-list";
                        LoadLink("contact-list");
                    });

                    $("#ResetButton").on("click", () => {
                       // location.href = "/contact-list";
                        LoadLink("contact-list");
                    });
                    break;
                default:

                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page)as string)

                    $("#fullName").val(contact.fullName);
                    $("#contactNumber").val(contact.contactNumber);
                    $("#emailAddress").val(contact.emailAddress);

                    $("#editButton").on("click", (event) => {
                        event.preventDefault();

                        contact.fullName = $("#fullName").val() as string;
                        contact.contactNumber = $("#contactNumber").val() as string;
                        contact.emailAddress = $("#emailAddress").val() as string;

                        //replace the contact in localStorage
                        localStorage.setItem(page, contact.serialize() as string);
                        // location.href = "/contact-list"
                        LoadLink("contact-list");
                    });

                    $("#ResetButton").on("click", () => {
                       // location.href = "/contact-list";
                        LoadLink("contact-list");
                    });
                    break;
            }
        }
    function DisplayLoginPage(){
        console.log("Called DisplayLoginPage");

        let messageArea = $("#messageArea");
        messageArea.hide();

        AddLinkEvents("register");

        $("#loginButton").on("click", function (){

            let success = false;
            let newUser = new core.User();

            $.get("./data/users.json", function (data){

                for(const user of data.users) {
                    //request succeeded
                    console.log(data.user);

                    let username:string = document.forms[0].username.value;
                    let password:string = document.forms[0].password.value;

                    if (username === user.Username && password === user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }


                    if(success) {
                        sessionStorage.setItem("user", newUser.serialize() as string);
                        messageArea.removeAttr("class").hide();
                        LoadLink("contact-list");

                    }else{
                        $("#username").trigger("focus").trigger("select");
                        messageArea
                            .addClass("alert alert-danger")
                            .text("Error: Invalid Credentials")
                            .show();
                    }

                    $("#cancelButton").on("click", function (){
                        document.forms[0].reset();
                        LoadLink("home");


                    })

            })


        });


    }

    function DisplayRegisterPage(){
        console.log("Called DisplayRegisterPage");
        AddLinkEvents("login");
    }

    function Display404Page(){
        console.log("Called Display404Page");
    }

    function ActiveLinkCallBack(): Function{

        switch (router.ActiveLink){
            case "home": return DisplayHomePage;
            case "about": return DisplayAboutUsPage;
            case "services": return DisplayServicesPage;
            case "contact": return DisplayContactUsPage;
            case "contact-list": return DisplayContactListPage;
            case "register": return DisplayRegisterPage;
            case "login": return DisplayLoginPage;
            case "edit": return DisplayEditPage;
            case "404": return Display404Page;
            default:
                console.error("Error: callback does not exist" + router.ActiveLink);
                return new Function ();
        }
    }

    function capitalizeFirstLetter(str:string){
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function LoadHeader(){
        $.get("/views/components/header.html", function (html_data:string)
        {
            $("header").html(html_data);
            document.title = capitalizeFirstLetter(router.ActiveLink);

            $(`li > a:contains(${document.title})`).addClass("active").attr("aria-current", "page");

            AddNavigationEvents();
            CheckLogin();
        });
    }

    function LoadContent(){

        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallBack();

        $.get(`/views/content/${page_name}.html`, function (html_data:string){
            $("main").html(html_data);

            CheckLogin();
            callback();
        });
    }
    function  LoadFooter(){
        $.get("/views/components/footer.html", function (html_data:string){

            $("footer").html(html_data);
        });
    }

    function Start(){
        console.log("App Started");

        LoadHeader();

        LoadLink("home");

        LoadFooter();
    }
    window.addEventListener("load", Start);

})();