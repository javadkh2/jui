import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";
import * as jui from "../jui";

export function Subscribe({ observables = [], children }) {
  const mapper = children[0] || ((...args) => [args]);
  return combineLatest(observables).pipe(map((items) => mapper(...items)));
}
