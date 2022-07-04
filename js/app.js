import _ from "./lib/@atomic/core.js";
import $ from "./lib/@atomic/reactives.js";
import dom from "./lib/@atomic/dom.js";
import * as v from "./todos.js";

const li = dom.tag('li'),
      label = dom.tag('label'),
      input = dom.tag('input'),
      div = dom.tag('div'),
      button = dom.tag('button'),
      checkbox = dom.tag('input', {class: "toggle", type: "checkbox"});

function getId(el){
  const todo = _.closest(el, "li");
  return parseInt(dom.attr(todo, "data-id"));
}

function todoItem(item){
  const cb = checkbox();
  cb.checked = item.status === "completed"
  return [div({class: "view"},
    cb,
    label(item.title),
    button({class: "destroy"})),
    input({class: "entry", value: item.title})
  ];
}

_.each(function(el){
  const entry = dom.sel1(".new-todo", el),
        list = dom.sel1(".todo-list"),
        filters = dom.sel1(".filters"),
        count = dom.sel1(".todo-count strong"),
        all = dom.sel1("#toggle-all");
  const $state = $.cell(v.init()),
        $todo = $.map(_.get(_, "todo"), $state),
        $shown = $.map(v.shown, $state),
        $active = $.map(_.pipe(v.active, _.count), $todo),
        $total = $.map(_.count, $todo),
        $nothingDone = $.map(_.eq, $active, $total);

  function doneEditing(e){
    dom.removeClass(_.closest(e.target, "[data-id]"), "editing");
    _.swap($state, v.updateTodo(getId(e.target), "title", dom.value(e.target)));
  }

  $.sub($state, _.log);
  $.sub(dom.hash(window), function(h){
    const hash = h || "#/";
    const views = dom.sel("a", filters);
    _.each(dom.removeClass(_, "selected"), views);
    dom.addClass(dom.sel1(`a[href='${hash}']`), "selected");
    _.swap($state, v.selectView(hash.replace("#/", "") || "all"));
  });
  $.sub($shown, function(shown){
    dom.html(list, _.map(function(item){
      return _.doto(li({"data-id": item.id}, todoItem(item)), dom.toggleClass(_, "completed", item.status === "completed"));
    }, shown));
  });
  $.sub($active, dom.html(count, _));
  $.sub($nothingDone, dom.prop(all, "checked", _));

  $.on(el, "dblclick", "[data-id]", function(e){
    dom.addClass(this, "editing");
    const tb = dom.sel1(".entry", this);
    tb.selectionStart = tb.selectionEnd = tb.value.length;
    tb.focus();
  });
  $.on(el, "focusout", "[data-id].editing input.entry", doneEditing)
  $.on(el, "keydown", "[data-id].editing input.entry", function(e){
    if (e.keyCode === 13){
      doneEditing(e);
    }
  });
  $.on(el, "change", "#toggle-all", function(e){
    _.swap($state, v.toggle);
  });
  $.on(el, "click", ".clear-completed", function(e){
    _.swap($state, v.clearCompleted);
  });
  $.on(entry, "keydown", function(e){
    if (e.keyCode === 13){
      _.swap($state, v.addTodo(this.value));
      this.value = "";
    }
  });
  $.on(el, "click", "button.destroy", function(e){
    _.swap($state, v.removeTodo(getId(e.target)));
  });
  $.on(el, "change", "li[data-id] input[type='checkbox']", function(e){
    _.swap($state, v.updateTodo(getId(e.target), "status", e.target.checked ? "completed" : "active"));
  });

}, dom.sel(".todoapp"));
