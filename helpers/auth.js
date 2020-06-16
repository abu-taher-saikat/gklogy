module.exports = {
    ensureAuthenticated : function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Not Authorize');
        // res.redirect('/users/login')
        res.redirect('/questions/qn')
    }
}