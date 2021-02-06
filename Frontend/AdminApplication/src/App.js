import { Container } from "react-bootstrap";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import Analytics from "./Analytics";
import Map from "./components/Map";
import LeafletMap from "./components/LeafletMap";
import MapCluster from "./components/MapCluster";
import AnalyticsComponent from "./AnalyticsComponent";
import AppBar from "./AppBar";
import AppDrawer from "./Drawer";
import routeConstants from "./shared/constants/routes";

const {
  SIGNUP,
  LOGIN,
  LANDINGPAGE,
  HOME,
  ANALYTICS,
  BARCHART1,
  BARCHART2,
  DOUGHNUTCHART1,
  DOUGHNUTCHART2,
  FORGETPASSWORD,
  MAP,
  MAPCLUSTER,
} = routeConstants;

function App() {
  return (
    <Container>
      <Router>
        <AuthProvider>
          <Switch>
            <Route path={SIGNUP.route} component={Signup} />
            <Route exact path={LANDINGPAGE.route} component={Login} />
            <PrivateRoute exact path={HOME.route} component={Dashboard} />
            <PrivateRoute
              path={ANALYTICS.route}
              exact
              component={AnalyticsComponent}
            />
            <PrivateRoute exact path={BARCHART1.route}>
              <AppBar />
              <AppDrawer />
              <Analytics.BarChart />
            </PrivateRoute>
            <PrivateRoute exact path={BARCHART2.route}>
              <AppBar />
              <AppDrawer />
              <Analytics.BarChart2 />
            </PrivateRoute>
            <PrivateRoute exact path={DOUGHNUTCHART2.route}>
              <AppBar />
              <AppDrawer />
              <Analytics.DoughnutChart2 />
            </PrivateRoute>
            <PrivateRoute exact path={DOUGHNUTCHART1.route}>
              <AppBar />
              <AppDrawer />
              <Analytics.DoughnutChart1 />
            </PrivateRoute>
            <Route exact path={LOGIN.route} component={Login} />
            <Route
              exact
              path={FORGETPASSWORD.route}
              component={ForgotPassword}
            />
            <PrivateRoute exact path={MAP.route} component={Map} />
            <PrivateRoute
              exact
              path={MAPCLUSTER.route}
              component={MapCluster}
            />
            <PrivateRoute exact path="/map2" component={LeafletMap} />
          </Switch>
        </AuthProvider>
      </Router>
    </Container>
  );
}

export default App;
