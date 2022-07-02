import _ from "./lib/@atomic/core.js";

export function init(){
  return {
    view: "all",
    next: 1,
    todo: []
  }
}

function todo(id, title){
  const status = "active";
  return {id, title, status};
}

export function addTodo(title){
  return function(state){
    const id = _.get(state, "next");
    return _.chain(state,
      _.update(_, "todo", _.conj(_, todo(id, title))),
      _.assoc(_, "next", id + 1));
  }
}

export function removeTodo(id){
  return function(state){
    return _.update(state, "todo", _.filtera(function(item){
      return _.get(item, "id") !== id;
    }, _));
  }
}

export const active =  _.filtera(function(item){
  return _.get(item, "status") !== "completed";
}, _);

export function clearCompleted(state){
  return _.update(state, "todo", active);
}

export function updateTodo(id, key, value){
  return function(state){
    return _.update(state, "todo", _.mapa(function(item){
      return _.get(item, "id") === id ? _.assoc(item, key, value) : item;
    }, _));
  }
}

export function toggle(state){
  const todo = _.get(state, "todo"),
        total = _.count(todo),
        completed = _.count(_.filter(function(item){
          return _.get(item, "status") === "completed";
        }, todo));
  return _.assoc(state, "todo", _.mapa(_.assoc(_, "status", completed !== total ? "completed" : "active"), todo));
}

const views = ["all", "active", "completed"];

export function selectView(view){
  return function(state){
    return _.includes(views, view) ? _.assoc(state, "view", view) : state;
  }
}
