require("source-map-support").install();
const { CommandLine } = require("../lib/CommandLine");

const Package = require('../../../package');

new CommandLine({ 
  name: Package.name,
  version: Package.version,
})
  .start()
  .then(() => console.log('Command line exited successfully'));