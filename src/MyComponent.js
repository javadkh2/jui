import * as jui from "./jui";
import { map, filter, delay, throttleTime } from "rxjs/operators";
import { Subject, interval } from "rxjs";

function isOdd(num) {
  return num % 2 === 1;
}

const obsMap = (obs) => (mapper) => obs.pipe(map(mapper));

export function MyComponent({ title, $text }) {
  let $num = new Subject();
  const $$num = obsMap($num);

  function onclick(e) {
    $num.next(Math.ceil(Math.random() * 1000));
    console.log("click event", e);
  }

  return (
    <div className="test">
      <h1>{title}</h1>
      <section>
        <div id={$text}>
          <h3>Its a timer</h3>
          Timer: {$text}
        </div>
      </section>
      <button onclick={onclick}>Click Me</button>
      {$$num((num) =>
        isOdd(num) ? (
          <div>the number is odd: {num}</div>
        ) : (
          <div>the number is even: {num}</div>
        )
      )}
    </div>
  );
}
