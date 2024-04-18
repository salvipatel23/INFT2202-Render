/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

"use strict";
/**
 * Import mongoose from mongoose
 */
import mongoose from 'mongoose';

/**
 * Access the Schema Class
 */
const Schema = mongoose.Schema;

const ContactSchema =  new Schema
(
    // ContactSchema details
    {
        FullName: String,
        ContactNumber: String,
        EmailAddress: String

    },
    {
        collection: "contacts" // Specifying the collection
    }
);
/**
 * Creating the Model based on the Schema Specified.
 * An Model is an Constructor for an document in the collection.
 * Means when we want to create an document we have to create the instance of the Model Which we have defined here
 * and then using the methods defined inside the Model Object we can interact with specified database collection.
 */
const Model = mongoose.model("Contact", ContactSchema);

/**
 * Export the Model to be used in other modules.
 */
export default Model;

