# Atomic • [TodoMVC](http://todomvc.com)

> Write Clojuresque functional core, imperative shell programs in JavaScript.

## Resources

- [Website](https://github.com/mlanza/atomic)

## Implementation

Atomic apps build on [this advice](https://github.com/mlanza/atomic#guidance-for-writing-apps).  This is demonstrated in the separation of

* its [functional core](./js/todos.js) and
* its [imperative shell](./js/app.js).

User interactions such as adding tasks effect abrupt changes to the UI.  Graceful animations are possible but slightly increase the implementation complexity.

## Getting Started

From the command line project root:

```bash
npm install
static # e.g. launch the static server of your choice
```

Then open your browser to the server address shown in the shell to see the app.

See [demo](https://doesideas.com/programming/todo/).

## Browser as REPL

Open the browser console in Developer Tools.  Note what's being written to the log as you interact with the app.

Temporarily expose choice vars as globals to facilitate interactive, REPL-driven development.

Enter `$state` into the console, for example, to access the world state.  Swap updates against it as desired.

Enter `cmd()` to expose all the modules as `_`, `$`, `dom`, `t`, etc. in the global namespace to further aid your interactivity.

## Credit

Created by [Mario T. Lanza](http://doesideas.com)
