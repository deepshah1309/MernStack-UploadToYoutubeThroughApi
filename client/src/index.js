import App from "./Components/App";
import Success from "./Components/Success";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route path="/success/:id" component={Success} />
    </Switch>
  </BrowserRouter>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<Routes />, rootElement);
