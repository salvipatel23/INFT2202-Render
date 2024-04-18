/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

let LOCAL= true;

let HostName, URI;

if(LOCAL)

{
    // database name in Atlas -> contacts.contacts
    URI= "mongodb://localhost/contacts";
    // connecting to localhost
    HostName = "localhost";
}
else
{
    // MongoDB Atlas Connection Data

    URI = "mongodb+srv://Spatel23:Spatel@2310@cluster0.ifbmaqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    HostName = "MongoDB Atlas";
}

export {HostName, URI};
export const SessionSecret = "INFT2202SessionSecret"