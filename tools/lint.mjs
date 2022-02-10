#!/usr/bin/env node

/**
 * lint.mjs - Simple linter for all JSON content within this project
 *
 * No options, no config, no overly complictaed output. Simply run it and it will go through all JSON files, recursively,
 * within the current directory and parse it with JSON.parse. If an error occurs, the script exists with 1, otherwise
 * with 0.
 *
 * Invalid JSON files are printed to stderr with the error message provided by JSON.parse.
 *
 * To use this script, a recent version of NodeJS is required, at least NodeJS 10 (but who still has this version 🤦‍).
 * No need to install any node modules, this is plain JavaScript in plain NodeJS, no modules, no libraries, nothing.
 */

import {readdir, readFile} from 'fs/promises';
import {join} from 'path';

const excludes = ['.git', 'node_modules'];

async function handleFile(dir, entry) {
    if (!entry.name.endsWith('.json')) {
        return true;
    }
    let jsonPath = join(dir, entry.name);
    const contents = await readFile(jsonPath, {encoding: 'utf8'});
    try {
        JSON.parse(contents);
    } catch(e) {
        console.error(`File ${jsonPath} is invalid. Error: ${e}`);
        return false;
    }
    return true;
}

function evaluateEntry(dir, entry) {
    if (excludes.includes(entry.name)) {
        return Promise.resolve(true);
    }
    if (entry.isDirectory()) {
        return walk(join(dir, entry.name));
    } else if (entry.isFile()) {
        return handleFile(dir, entry);
    } else {
        return Promise.resolve(true);
    }
}

async function walk(dir) {
    const entries = await readdir(dir, {
        withFileTypes: true,
    });

    return await Promise.all(entries.map((e) => evaluateEntry(dir, e))).then((results) => {
        return !results.includes(false);
    });
}

walk('.').then((r) => {
    if (!r) {
        process.exit(1);
    }
});
