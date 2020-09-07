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

function getElement(elm) {
  if (isElement(elm)) return elm;
  return document.createTextNode(elm.toString());
}

function append(elm, children) {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      append(elm, child);
    } else if (isObservable(child)) {
      let placeHolder = document.createTextNode("");
      elm.appendChild(placeHolder);
      child.subscribe((result) => {
        if (isObservable(result)) {
          throw new Error("more level of observable is not supported");
        }
        const childElement = getElement(result);
        elm.replaceChild(childElement, placeHolder);
        placeHolder = childElement;
      });
    } else {
      elm.appendChild(getElement(child));
    }
  });
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
