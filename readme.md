# Atomic • [TodoMVC](http://todomvc.com)

> Write ClojureScript in JavaScript without a transpiler.

## Resources

- [Website](https://github.com/mlanza/atomic)

## Implementation

Atomic apps build on [this advice](https://github.com/mlanza/atomic#guidance-for-writing-apps).  This is demonstrated in the separation of

* its [functional core](/libs/todos.js) and
* its [imperative shell](/libs/app.js).

User interactions such as adding tasks effect abrupt changes to the UI.  Graceful animations are possible but slightly increase the implementation complexity.

## Getting Started

From the command line project root:

```bash
npm install
static # e.g. launch the static server of your choice
```

Then open your browser to the server address shown in the shell to see the app.

See [demo](https://doesideas.com/todo/?monitor=*).

## Browser as an interactive console

Open the browser console in Developer Tools.  Enter `cmd()` to gain access to commands and stateful components to aid your interactivity.  Note what's being written to the log as you interact with the app.

Enter `$state` into the console, for example, to access the world state.  Swap updates against it as desired.

## Credit

Created by [Mario T. Lanza](http://doesideas.com)
