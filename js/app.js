import _ from "./lib/@atomic/core.js";
import $ from "./lib/@atomic/reactives.js";
import dom from "./lib/@atomic/dom.js";
import * as v from "./todos.js";

const li = dom.tag('li'),
      label = dom.tag('label'),
      div = dom.tag('div'),
      button = dom.tag('button'),
      checkbox = dom.tag('input', {class: "toggle", type: "checkbox"});

function getId(el){
  const todo = _.closest(el, "li");
  return parseInt(dom.attr(todo, "data-id"));
}

function todoItem(item){
  const input = checkbox();
  input.checked = item.status === "completed"
  return div({class: "view"},
    input,
    label(item.title),
    button({class: "destroy"}));
}

_.each(function(el){
  const entry = dom.sel1(".new-todo", el),
        list = dom.sel1(".todo-list"),
        count = dom.sel1(".todo-count strong");
  const $state = $.cell(v.init());

  $.sub($state, _.log);

  $.sub($state, function(state){
    const todos = _.thread(state, _.get(_, "todo"), state.view === "all" ? _.identity : _.filter(function(item){
      return item.status === state.view;
    }, _),  _.map(function(item){
      return _.doto(li({"data-id": item.id}, todoItem(item)), dom.toggleClass(_, "completed", item.status === "completed"));
    }, _));
    const active = _.thread(state, _.get(_, "todo"), v.active, _.count);
    dom.html(count, active);
    dom.html(list, todos);
  })

  $.on(el, "click", ".clear-completed", function(e){
    _.swap($state, v.clearCompleted);
  });

  $.on(entry, "keydown", function(e){
    if (e.keyCode === 13){
      _.swap($state, v.addTodo(this.value));
      this.value = "";
    }
  });
  $.sub(dom.hash(window), function(hash){
    _.swap($state, v.selectView(hash.replace("#/", "") || "all"));
  })
  $.on(el, "click", "button.destroy", function(e){
    _.swap($state, v.removeTodo(getId(e.target)));
  });
  $.on(el, "change", "[type='checkbox']", function(e){
    _.swap($state, v.updateTodoStatus(getId(e.target), e.target.checked ? "completed" : "active"));
  });

}, dom.sel(".todoapp"));
