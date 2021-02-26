module.exports = {
  checkArguments (...args) {
    return new Promise((resolve, reject) => {
      let checkPass = true;
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (!arg) {
          // TODO: 检查参数失败
        }
      }
    })
  }
}