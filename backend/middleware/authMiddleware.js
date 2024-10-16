// middleware/authMiddleware.js

module.exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();  // User is authenticated, continue to the next middleware/route
    } else {
        return res.redirect('/auth/sign-in');  // Redirect to sign-in page if not authenticated
    }
};
