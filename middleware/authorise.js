const { expressjwt: jwt } = require("express-jwt");
const { secret } = require("../helpers/config.json");
const db = require("../helpers/db.js");

module.exports = authorise;

function authorise(roles = []) {
  console.log("authorise roles", roles);
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  console.log("jwt:", jwt({ secret, algorithms: ["HS256"] }));

  return [
    // authenticate JWT token and attach user to request object (req.user)
    jwt({ secret, algorithms: ["HS256"] }),

    // authorise based on user role
    async (req, res, next) => {
      console.log("authorise", req.auth);
      try {
        const user = await db.User.findByPk(req.auth.id);
        console.log("!!!!!!!! authorise user", JSON.stringify(user));

        if (
          !user ||
          (roles.length && !roles.includes(user.role)) ||
          !user.active
        ) {
          // user no longer exists or role not authorised or user is deactivated
          // console.log("Uanauthorised");
          return res.status(401).json({ message: "Unauthorised" });
        }

        // authentication and authorisation successful
        // retrieve tenant and password from tbl_clients
        const { tenant, passwordHash } = await db.Client.findOne({
          where: { id: user.f_clientId },
        });
        // console.log("######################## ", tenant, passwordHash);
        req.auth.tenant = tenant;
        req.auth.passwordHash = passwordHash;

        req.auth.role = user.role;
        console.log("req.auth", req.auth);
        const refreshTokens = await user.getRefreshTokens();
        req.auth.ownsToken = (token) =>
          !!refreshTokens.find((x) => x.token === token);
        next();
      } catch (err) {
        console.log("authorise error: ", err);
        return res.status(400).json({ message: `Authorising problem: ${err}` });
      }
    },
  ];
}
