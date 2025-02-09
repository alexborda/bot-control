import App from "./App"; // ✅ Debe coincidir EXACTAMENTE con el archivo `App.jsx`
import { render } from "preact";
import "./index.css";

render(<App />, document.getElementById("app"));
