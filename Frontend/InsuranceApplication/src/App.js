import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RenderCard from "./components/RenderCard";
import RenderQuote from "./components/RenderQuote";
import MiniDrawer from "./components/MiniDrawer";
import Partners from "./components/Partners";
import Products from "./components/Products";
import Suggestion from "./components/Suggestion";
import AboutUs from "./components/AboutUs";
import routeConstants from "./shared/constants/routes";

const { HOME, QUOTE, PARTNERS, PRODUCTS, SUGGESTIONS, ABOUT } = routeConstants;

export const App = () => {
  return (
    <div className="app" data-testid="application">
      <Router>
        <Switch>
          <Route
            path={HOME.route}
            exact
            render={(location) => (
              <MiniDrawer RenderComponent={RenderCard} location={location} />
            )}
          ></Route>
          <Route
            path={QUOTE.route}
            exact
            render={(location) => (
              <MiniDrawer RenderComponent={RenderQuote} location={location} />
            )}
          ></Route>
          <Route
            path={PARTNERS.route}
            exact
            render={(location) => (
              <MiniDrawer RenderComponent={Partners} location={location} />
            )}
          ></Route>
          <Route
            path={PRODUCTS.route}
            exact
            render={(location) => (
              <MiniDrawer RenderComponent={Products} location={location} />
            )}
          ></Route>
          <Route
            path={SUGGESTIONS.route}
            exact
            render={(location) => (
              <MiniDrawer RenderComponent={Suggestion} location={location} />
            )}
          ></Route>
          <Route
            exact
            path={ABOUT.route}
            exact
            render={(location) => (
              <MiniDrawer RenderComponent={AboutUs} location={location} />
            )}
          ></Route>
        </Switch>
      </Router>
    </div>
  );
};
