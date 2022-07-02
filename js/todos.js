import _ from "./lib/@atomic/core.js";

const views = ["all", "active", "completed"];

export function selectView(view){
  return function(state){
    return _.includes(views, view) ? _.assoc(state, "view", view) : state;
  }
}

export function init(){
  return {
    view: "All",
    next: 3,
    todo: [
      {id: 1, title: "Buy milk", status: "active"},
      {id: 2, title: "Read Awake & Alive to Truth ~ J. Cooper", status: "active"}
    ]
  }
}

function todo(id, title){
  const status = "active";
  return {id, title, status};
}

export function addTodo(title){
  return function(state){
    const id = _.get(state, "next");
    return _.thread(state,
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

export function updateTodoStatus(id, status){
  return function(state){
    return _.update(state, "todo", _.mapa(function(item){
      return _.get(item, "id") === id ? _.assoc(item, "status", status) : item;
    }, _));
  }
}

export function toggle(state){
  const todo = _.get(state, "todo"),
        total = _.count(todo),
        active = _.count(_.filter(function(item){
          return _.get(item, "status") === "active";
        }, todo));
  return _.mapa(_.assoc(_, "status", total === active ? "completed" : "active"), todo);
}
