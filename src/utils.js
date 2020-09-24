import { isObservable, Subject } from "rxjs";
import { startWith } from "rxjs/operators";
export function $reflector(initial) {
  const subject = new Subject();
  return [subject.pipe(startWith(initial)), (item) => subject.next(item)];
}
