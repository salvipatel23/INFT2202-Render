/*
Name: Salvi Patel
course code: INFT2202-13964
IN Class Exercise - 3
Date: March 16, 2024
*/


"use strict";
/**
 * Using the Import statement (ES Module)
 */
import  http from "http";
import fs from 'fs';
import mime from "mime-types";

/**
 * Storing the mime lookup function
 */
let lookup  = mime.lookup;

// Defining the PORT
const port = process.env.PORT || 3000;

/**
 * Creating the instance of HTTP Server
 */
const server = http.createServer((req , res) =>
{
    /**
     * Extracting the url
     */
    let path  = req.url as string;

    /**
     * Checking whether the page it is home or not
     */
    if (path === '/' || path === "/home")
    {

        path = "/index.html";
    }

    /**
     * Getting the mime type of content inside the file
     */
    let mime_type = lookup(path.substring(1));


    fs.readFile(__dirname + path, function (err, data)
    {

        /**
         * If function - Unable to read the file
         */
        if(err)
        {
            /**
             *  status Code 404 Not Found
             */
            res.writeHead(404);

            res.end("Error 404 - File Not Found" + err.message);
            return;
        }
        if(!mime_type)
        {
            mime_type = "text/plain";
        }

        // Set Content Security headers and Response.
        res.setHeader("X-Content-Type-Options", "nosniff");


        res.writeHead(200, "OK",{'Content-Type': mime_type});

        /**
         *  end the response with some data
         */
        res.end(data);
    });
});


/**
 * Starting the HTTP Server
 */
server.listen((port) , () => {
    console.log(`Server Running at http:/localhost:${port}/`);
});