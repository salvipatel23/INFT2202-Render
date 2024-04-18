/*
 * Name: Salvi Patel
 * Course Code - INFT 2202-02
 * In Class-4 : Mongoose and MongoDB Atlas
 * Date: April 17, 2024
*/

import express from 'express';
const router = express.Router();

/* Getting users data. */

// response.send
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export default router;
