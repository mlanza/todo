# Atomic • [TodoMVC](http://todomvc.com)

> Write Clojuresque functional core, imperative shell programs in JavaScript.

## Resources

- [Website](https://github.com/mlanza/atomic)

## Implementation

To model an atomic app follow [this advice](https://github.com/mlanza/atomic#guidance-for-writing-apps).

## Getting Started

From the command line project root:

```bash
npm install
static # e.g. bring up the static server of your choice
```

Then open your browser to the server address shown in the shell to see the app.  Open the browser console in Developer Tools.  Note what's being written to the log as you interact with the app.  Read the comments in the app source.

Interact with whatever vars have been deliberately exposed as globals.  Temporarily expose whichever others you choose.  Type `$state` in the console, for example, to access the world state.  Swap functions against it at will.  This is your REPL.

To gain direct access a slew of commands type `cmd()`.  This will expose all the modules as `_`, `$`, `dom`, `t`, etc. in the global namespace and facilitate interactive development.

## Credit

Created by [Mario T. Lanza](http://doesideas.com)
