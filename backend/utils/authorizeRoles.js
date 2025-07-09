export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied: '${userRole}' role not authorized`,
      });
    }

    next();
  };
};
