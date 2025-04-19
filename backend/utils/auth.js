module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ message: 'Не авторизован' });
        }
        
        req.flash('error', 'Пожалуйста, войдите в систему для доступа');
        res.redirect('/auth/login');
    },
    ensureAdmin: function (req, res, next) {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(403).json({ message: 'Доступ запрещён: требуются права администратора' });
        }
        
        req.flash('error', 'Доступ запрещён: требуется права администратора');
        res.redirect('/');
    }
};
