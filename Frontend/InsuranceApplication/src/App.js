
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import RenderCard from './components/RenderCard';
import RenderQuote from './components/RenderQuote';
import MiniDrawer from './components/MiniDrawer';
import Partners from './components/Partners';
import Products from './components/Products';
import Suggestion from './components/Suggestion';
import AboutUs from './components/AboutUs';
export const App=()=> {
  return (
    <div className="app" data-testid="application">
      <Router>
        <Switch>
          <Route path="/" exact render={(location) => <MiniDrawer RenderComponent={RenderCard} location={location}/>}></Route>
          <Route path="/quote" exact render={(location) => <MiniDrawer RenderComponent={RenderQuote} location={location}/>}></Route>
          <Route path="/partners" exact render={(location) => <MiniDrawer RenderComponent={Partners} location={location}/>}></Route>
          <Route path="/products" exact render={(location) => <MiniDrawer RenderComponent={Products} location={location}/>}></Route>
          <Route path="/suggestions" exact render={(location) => <MiniDrawer RenderComponent={Suggestion} location={location}/>}></Route>
          <Route exact path="/aboutus" exact render={(location) => <MiniDrawer RenderComponent={AboutUs} location={location}/>}></Route>
        </Switch>
      </Router>
    </div>
  );
}


