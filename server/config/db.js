"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSecret = exports.URI = exports.HostName = void 0;
let LOCAL = true;
let HostName, URI;
if (LOCAL) {
    exports.URI = URI = "mongodb://localhost/contacts";
    exports.HostName = HostName = "localhost";
}
else {
    exports.URI = URI = "mongodb+srv://Spatel23:Spatel@2310@cluster0.ifbmaqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    exports.HostName = HostName = "MongoDB Atlas";
}
exports.SessionSecret = "INFT2202SessionSecret";
//# sourceMappingURL=db.js.map