import { isObservable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { throws } from "assert";

function isElement(element) {
  return (
    element instanceof Element ||
    element instanceof HTMLDocument ||
    element instanceof Node
  );
}

export function getElement(elm) {
  if (isElement(elm)) return elm;
  return document.createTextNode(elm.toString());
}

function getPlaceholder(test = "observable_placeholder") {
  return document.createComment(test);
}

const replaceElem = (elm) => {
  let oldElm;
  function replaceOld(n) {
    if (oldElm && oldElm.clean) {
      oldElm.clean();
    }
    oldElm = n;
  }
  replaceOld(elm);
  return function replace(newElement) {
    oldElm.parentNode.replaceChild(newElement, oldElm);
    replaceOld(newElement);
  };
};

function replaceObservable(replace, observable) {
  let unsubscribeChild;

  function clean() {
    if (unsubscribeChild) {
      unsubscribeChild();
    }
  }

  const subject = observable.subscribe(function subscribeFn(data) {
    console.log("new event");
    clean();
    if (isObservable(data)) {
      unsubscribeChild = replaceObservable(replace, data);
    } else {
      // TODO: handel arrays
      replace(getElement(data));
    }
  });

  return function unsubscribe() {
    console.log("Unsubscribe");
    clean();
    subject.unsubscribe();
  };
}

function append(elm, children) {
  const cleaners = [];
  children.forEach((child) => {
    if (Array.isArray(child)) {
      append(elm, child);
    } else if (isObservable(child)) {
      const place = getPlaceholder();
      elm.appendChild(place);
      cleaners.push(replaceObservable(replaceElem(place), child));
    } else {
      elm.appendChild(getElement(child));
    }
  });
  elm.clean = function clean() {
    console.log("run cleaners");
    cleaners.forEach((cleaner) => cleaner());
  };
}

function isEvent([key]) {
  return key.startsWith("on");
}

function isAttribute([key]) {
  return !isEvent([key]);
}

function getEventName(key) {
  return key.substr(2).toLowerCase();
}

export function element(type, properties, ...children) {
  const props = properties ? properties : {};

  if (typeof type === "function") {
    return type({ ...properties, children });
  }

  const element = document.createElement(type);

  Object.entries(props)
    .filter(isAttribute)
    .forEach(([key, value]) => {
      if (isObservable(value)) {
        value.subscribe((attr) => element.setAttribute(key, attr));
      } else element.setAttribute(key, value);
    });

  Object.entries(props)
    .filter(isEvent)
    .forEach(([key, cb]) => {
      element.addEventListener(getEventName(key), cb);
    });

  if (children && children.length) {
    append(element, children);
  }

  return element;
}
