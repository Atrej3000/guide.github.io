export const qs = (selector, scope = document) => scope.querySelector(selector);
export const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
export const on = (target, eventName, handler, options) => {
  if (target) target.addEventListener(eventName, handler, options);
};
