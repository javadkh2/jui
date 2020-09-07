import * as jui from "./jui";
import { map, filter, delay, throttleTime } from "rxjs/operators";
import { Subject, interval, combineLatest } from "rxjs";

function isOdd(num) {
  return num % 2 === 1;
}

const get = (obs, mapper) => obs.pipe(map(mapper));

const add = (...$args) =>
  get(combineLatest(...$args), (result) =>
    result.reduce((acc, a) => acc + a, 0)
  );

function TestComponent({ text, children }) {
  const $a = new Subject();
  const $b = new Subject();
  return (
    <div>
      {text}-{children}
      <div>
        <input
          type="number"
          oninput={(e) => {
            $a.next(+e.target.value);
          }}
        />
        <input
          type="number"
          oninput={(e) => {
            $b.next(+e.target.value);
          }}
        />
      </div>
      a: {$a} - b:{$b}
      <div>{add($a, $b)}</div>
    </div>
  );
}

export function MyComponent({ title, $text }) {
  let $num = new Subject();

  function onclick(e) {
    $num.next(Math.ceil(Math.random() * 1000));
    console.log("click event", e);
  }

  return (
    <div className="test">
      <h1>{title}</h1>
      <TestComponent text="hello world">lala {$text}</TestComponent>
      <section>
        <div id={$text}>
          <h3>Its a timer</h3>
          Timer: {$text}
        </div>
      </section>
      {get($num, (num) =>
        isOdd(num) ? (
          <div>the number is odd: {num}</div>
        ) : (
          <div>the number is even: {$text}</div>
        )
      )}
      <button onclick={onclick}>Click Me</button>
    </div>
  );
}
