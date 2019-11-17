#!/usr/bin/env node
/* eslint-disable */
require('source-map-support').install();
const { NanoShell } = require('../lib');
const Package = require('../../../package');
const cmd = new NanoShell({ version: Package.version });

cmd
  .start()
  .catch((error: Error) => {
    // Empty line for readability
    console.log(' ');

    cmd.logger.error(error);
    process.exit(1);
  })
