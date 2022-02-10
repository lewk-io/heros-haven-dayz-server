# Hero's Haven Server config

## Linting

In order to make sure that the configuration is valid (mostly the JSON part), there is a linter, which can be run with:

```shell
./tools/lint.mjs
```

See the notes in this file for more documentation about the linter.

There is also a pre-commit hook available for your git installation, which can be installed with:
```shell
./tools/install.sh
```

It will prevent committing if there is any invalid JSON file in the working tree.
