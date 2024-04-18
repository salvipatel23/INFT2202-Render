/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

// import express
import express, {Request, Response, NextFunction} from "express";


// Functions for UserDisplayName
export function UserDisplayName(req: Request): string
{
    if(req.user)
    {
        let user = req.user as UserDocument;

        return user.DisplayName.toString();
    }

    return "";
}

// Function Authguard
export  function AuthGuard(req: Request, res: Response, next: NextFunction)
{
    if(!req.isAuthenticated())
    {
        return res.redirect("/login");
    }
    next(); // Call the next middleware
}