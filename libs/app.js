import _ from "./atomic_/core.js"; //shadow modules (see how some names have trailing underscores) support partial application without a build step
import $ from "./atomic_/shell.js";
import dom from "./atomic_/dom.js"; //includes its own reactives
import * as t from "./todos.js"; // functional core, named "t" for the domain
import {reg} from "./cmd.js"

//create what elements?
const {li, label, input, div, button, checkbox} = dom.tags([
  'li',
  'label',
  'input',
  'div',
  'button',
  'checkbox', ['input', {class: "toggle", type: "checkbox"}]
]);

function getId(el){
  const todo = _.closest(el, "li");
  return parseInt(dom.attr(todo, "data-id"));
}

//view for newly created items where a view is just a function returning elements
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

// locate potentially matching element
_.maybe(dom.sel1("#todoapp"), function(el){
  dom.addClass(el, "todoapp");

  //locate fixed, relative elements
  const entry = dom.sel1(".new-todo", el),
        list = dom.sel1(".todo-list"),
        filters = dom.sel1(".filters"),
        views = dom.sel("a", filters),
        count = dom.sel1(".todo-count strong"),
        all = dom.sel1("#toggle-all");

  //setup necessary reactives
  const $state = $.atom(t.init()),
        $hash = dom.hash(window),
        $todo = $.map(_.get(_, "todo"), $state), //note the regular use of _ as a partial application placeholder, no build step required
        $shown = $.map(t.shown, $state),
        $active = $.map(_.pipe(t.active, _.count), $todo),
        $total = $.map(_.count, $todo),
        $nothingDone = $.map(_.eq, $active, $total);

  reg({t, $state, $todo, $shown, $active, $total, $nothingDone}); //trick for temporarily exposing choice objects for interactive, REPL-driven development

  function doneEditing(e){
    dom.removeClass(_.closest(e.target, "[data-id]"), "editing");
    $.swap($state, t.updateTodo(getId(e.target), "title", dom.value(e.target)));
  }

  //subscribe to reactives
  $.sub($hash, _.map(_.either(_, "#/")), function(hash){
    $.each(dom.removeClass(_, "selected"), views);
    dom.addClass(dom.sel1(`a[href='${hash}']`), "selected");
    $.swap($state, t.selectView(hash.replace("#/", "") || "all"));
  });
  $.sub($shown, function(shown){
    dom.html(list, _.map(function(item){
      return $.doto(li({"data-id": item.id}, todoItem(item)), dom.toggleClass(_, "completed", item.status === "completed"));
    }, shown));
  });
  $.sub($active, dom.html(count, _));
  $.sub($nothingDone, dom.prop(all, "checked", _));

  //subscribe to dom preferring delegate events
  $.on(el, "dblclick", "[data-id]", function(e){
    dom.addClass(this, "editing");
    const tb = dom.sel1(".entry", this);
    tb.selectionStart = tb.selectionEnd = tb.value.length;
    tb.focus();
  });
  $.on(el, "focusout", "[data-id].editing input.entry", doneEditing);
  $.on(el, "keydown", "[data-id].editing input.entry", function(e){
    if (e.keyCode === 13){
      doneEditing(e);
    }
  });
  $.on(el, "change", "#toggle-all", function(e){
    $.swap($state, t.toggle);
  });
  $.on(el, "click", ".clear-completed", function(e){
    $.swap($state, t.clearCompleted);
  });
  $.on(entry, "keydown", function(e){
    if (e.keyCode === 13){
      $.swap($state, t.addTodo(this.value));
      this.value = "";
    }
  });
  $.on(el, "click", "button.destroy", function(e){
    $.swap($state, t.removeTodo(getId(e.target)));
  });
  $.on(el, "change", "li[data-id] input[type='checkbox']", function(e){
    $.swap($state, t.updateTodo(getId(e.target), "status", e.target.checked ? "completed" : "active"));
  });
});
