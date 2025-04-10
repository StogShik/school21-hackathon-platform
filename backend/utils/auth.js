module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Пожалуйста, войдите в систему для доступа');
        res.redirect('/auth/login');
    },
    ensureAdmin: function (req, res, next) {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        req.flash('error', 'Доступ запрещён: требуется права администратора');
        res.redirect('/');
    }
};
