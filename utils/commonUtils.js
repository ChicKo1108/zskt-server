module.exports = {
  checkArguments(ctx, ...args) {
    let checkPass = true;
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg === null || arg === undefined) {
        checkPass = false;
        break;
      }
    }
    if (!checkPass) {
      ctx.response.status = 500;
      ctx.body = {
        msg: "MISSING_PARAMS",
      };
    }
  }
}