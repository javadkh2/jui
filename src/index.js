import { MyComponent } from "./MyComponent";
import { range, interval } from "rxjs";

document.body.appendChild(MyComponent({ title: "test",  $text: interval(1000) }));
