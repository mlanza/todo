import _ from "./lib/atomic_/core.js";

//big bang world state
export function init(){
  return {
    view: "all",
    next: 1,
    todo: []
  }
}

//create a todo
function todo(id, title){
  const status = "active";
  return {id, title, status};
}

//graft it into the todo list
export function addTodo(title){
  return function(state){
    const id = _.get(state, "next");
    return _.chain(state,
      _.update(_, "todo", _.conj(_, todo(id, title))),
      _.assoc(_, "next", id + 1));
  }
}

//remove a todo from the list
export function removeTodo(id){
  return _.update(_, "todo", _.filtera(function(item){
    return _.get(item, "id") !== id;
  }, _));
}

//filter out completed todos, keeping only unfinished ones active
export const active =  _.filtera(function(item){
  return _.get(item, "status") !== "completed";
}, _);

//apply the active filter against the app state
export const clearCompleted =
  _.update(_, "todo", active);

//update a todo per some user edit
export function updateTodo(id, key, value){
  return _.update(_, "todo", _.mapa(function(item){
    return _.get(item, "id") === id ? _.assoc(item, key, value) : item;
  }, _));
}

//toggle the todo status
export function toggle(state){
  const todo = _.get(state, "todo"),
        total = _.count(todo),
        completed = _.count(_.filter(function(item){
          return _.get(item, "status") === "completed";
        }, todo));
  return _.assoc(state, "todo", _.mapa(_.assoc(_, "status", completed !== total ? "completed" : "active"), todo));
}

//can the todo be seen?
export function shown(state){
  return state.view === "all" ? state.todo : _.filtera(function(item){
    return item.status === state.view;
  }, state.todo);
}

const views = ["all", "active", "completed"];

//choose the desired view
export function selectView(view){
  return function(state){
    return _.includes(views, view) ? _.assoc(state, "view", view) : state;
  }
}
