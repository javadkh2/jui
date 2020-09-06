import * as jui from "./jui";

export function MyComponent({ title, $text }) {
  let count = 0;
  return (
    <div className="test">
      <h1>{title}</h1>
      <section>
        <div>{$text.map((text) => `message ${++count}: ${text}`)}</div>
      </section>
    </div>
  );
}
