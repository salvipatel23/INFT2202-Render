"use strict";
var core;
(function (core) {
    class Contact {
        _fullName;
        _contactNumber;
        _emailAddress;
        constructor(fullName = "", contactNumber = "", emailAddress = "") {
            this._fullName = fullName;
            this._contactNumber = contactNumber;
            this._emailAddress = emailAddress;
        }
        get fullName() {
            return this._fullName;
        }
        set fullName(value) {
            this._fullName = value;
        }
        get contactNumber() {
            return this._contactNumber;
        }
        set contactNumber(value) {
            this._contactNumber = value;
        }
        get emailAddress() {
            return this._emailAddress;
        }
        set emailAddress(value) {
            this._emailAddress = value;
        }
        toString() {
            return `Full Name ${this._fullName} \n Contact Number ${this._contactNumber} \n Email Address ${this._emailAddress}`;
        }
        serialize() {
            if (this._fullName !== "" && this._contactNumber !== "" && this._emailAddress !== "") {
                return `${this._fullName}, ${this._contactNumber}, ${this._emailAddress}`;
            }
            console.error("One or more of the contact properties is missing");
            return null;
        }
        deserialize(localStorageData) {
            let propertyArray = localStorageData.split(",");
            this._fullName = propertyArray[0];
            this._contactNumber = propertyArray[1];
            this._emailAddress = propertyArray[2];
        }
    }
    core.Contact = Contact;
})(core || (core = {}));