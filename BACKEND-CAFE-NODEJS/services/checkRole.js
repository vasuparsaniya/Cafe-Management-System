require('dotenv').config();

function checkRole(req, res, next) {
    if (res.locals.role == process.env.USER) {
        res.sendStatus(401);  //Unauthorized
    }
    else {
        next();
    }
}

module.exports = { checkRole: checkRole }  //export checkRole function as object 


/*==>Some API is not allow to use by user
  ==>like /get , /update API does not allow to user only allow to admin*/