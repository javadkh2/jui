import * as jui from "./jui";
import { map, filter, delay, throttleTime, startWith } from "rxjs/operators";
import { Subject, interval, combineLatest } from "rxjs";
import { Subscribe } from "./Components/Subscribe";
import { $reflector } from "./utils";

function isOdd(num) {
  return num % 2 === 1;
}

const get = (obs, mapper) => obs.pipe(map(mapper));

const add = (...$args) =>
  get(combineLatest(...$args), (result) =>
    result.reduce((acc, a) => acc + a, 0)
  );

function subscribe(observables = [], children) {
  return combineLatest(observables).pipe(map((items) => children(...items)));
}

function TestComponent({ text, children }) {
  const [$a, nextA] = $reflector(0);
  const [$b, nextB] = $reflector(0);
  return (
    <div>
      {text}-{children}
      <div>
        <input
          type="number"
          oninput={(e) => {
            nextA(+e.target.value);
          }}
        />
        <input
          type="number"
          oninput={(e) => {
            nextB(+e.target.value);
          }}
        />
      </div>
      a: {$a} - b:{$b}
      <br />
      <div>{add($a, $b)}</div>
      <Subscribe observables={[$a, $b]}>
        {(a, b) => {
          if (!a && !b) return interval(1000).pipe(startWith("Zero counter!"));
          if (!a || !b) return <div>NO DATA {interval(1000)}</div>;
          return a + b;
        }}
      </Subscribe>
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
      <TestComponent text="hello world">lala</TestComponent>
      <section>
        <div id={$text}>
          <h3>Its a timer</h3>
          Timer: {$text}
        </div>
      </section>
      <Subscribe observables={[$num]}>
        {(num) =>
          isOdd(num) ? (
            <div>the number is odd: {num}</div>
          ) : (
            <div>the number is even: {$text}</div>
          )
        }
      </Subscribe>
      <button onclick={onclick}>Click Me</button>
    </div>
  );
}
