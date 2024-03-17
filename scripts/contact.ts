/*
Name: Salvi Patel
course code: INFT2202-13964
IN Class Exercise - 3
Date: March 16, 2024
*/

"use strict";

namespace core
{
    export class Contact
    {

        /**
         * Defining the instance variables
         */
        private _fullName:string;
        private _contactNumber: string;
        private _emailAddress : string;


        /**
         * Constructor method
         * @param fullName
         * @param contactNumber
         * @param emailAddress
         */
        constructor(fullName = "", contactNumber = "", emailAddress = "")
        {
            /*
             Initializing  the value of variables
             */
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }

        /**
         * Getter and Setter methods
         */

        public get fullName(): string
        {
            return this._fullName;
        }

        public set fullName( value: string)
        {
            this._fullName = value;
        }

        public get contactNumber(): string
        {
            return this._contactNumber;
        }

        public set contactNumber(value: string)
        {
            this._contactNumber = value;
        }

        public get emailAddress(): string
        {
            return this._emailAddress;
        }

        public set emailAddress(value: string) {
            this._emailAddress = value;
        }

        public  toString() : string
        {
            return `Full Name ${this._fullName} \n Contact Number ${this._contactNumber} \n Email Address ${this._emailAddress}`;
        }

        /**
         * This method write the record to the local storage
         */
        serialize(): string | null {
            if (this._fullName !== "" && this._contactNumber !== "" && this._emailAddress !== "") {
                return `${this._fullName}, ${this._contactNumber}, ${this._emailAddress}`;
            }
            console.error("One or more of the contact properties is missing");
            return null;
        }

        /**
         * Reading a record from localStorage
         */
        public deserialize(localStorageData: string)
        {
            let propertyArray = localStorageData.split(",");
            // Setting the value of the object properties
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }
    }
}