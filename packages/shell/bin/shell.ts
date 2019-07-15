#!/usr/bin/env node
/* eslint-disable */
require('source-map-support').install();
const { CommandLine } = require('../lib/CommandLine');
const Package = require('../../../package');
const cmd = new CommandLine({ version: Package.version });

cmd
  .start()
  .catch((error: Error) => {
    // Empty line for readability
    console.log(' ');

    cmd.logger.error(error);
    // process.exit(1);
  })
