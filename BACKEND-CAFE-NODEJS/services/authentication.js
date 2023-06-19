require('dotenv').config()
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {

    //In this function we check that any API run then token will be exists in header or not

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // const token = authHeader && authHeader.split(' ')[0] === 'Bearer' && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);   //unauthorized
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if (err) {
            return res.sendStatus(403);   //forbiden access
        }
        else {
            res.locals = response;        // res.locals  is an object that contains response local variables. 
            next();
        }
    })
}


module.exports = { authenticateToken: authenticateToken }  //export middleware function  as object 




/*==>authenticateToken() is an middleware function
  ==>If JWTToken is valid then decoded token's playload(data) as the response local variables(res.locals)
  ==>This Encode && Decodeusing ACCESS_TOKEN secret key
  ==>if JWTToken is not valid then show the error  
  ==>next() passes the control to the next middleware function
*/