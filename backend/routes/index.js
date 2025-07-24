const users = require("./users");
const signIn = require("./sign_in");
const roles = require("./roles");
const departments = require("./departments");
const permissions = require("./permissions");
const menu = require("./menu");
const requests = require("./requests");

// const permissionRequests = require("./permission_requests");
// const auditLogs = require("./audit_logs");

module.exports.initialize = (app) => {
  app.use("/users", users);
  app.use("/sign_in", signIn);
  app.use("/roles", roles);
  app.use("/departments", departments);
  app.use("/permissions", permissions);
  app.use("/menus", menu);
  app.use("/requests",requests );

  // app.use("/permission_requests", permissionRequests);
  // app.use("/audit_logs", auditLogs);
};
