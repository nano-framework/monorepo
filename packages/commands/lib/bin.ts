require("source-map-support").install();
const { CommandLine } = require("./CommandLine");

new CommandLine()
  .start()
  .then(() => console.log('Command line exited successfully'));