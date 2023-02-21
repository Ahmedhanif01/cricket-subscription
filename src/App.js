import React, { Suspense } from 'react';
import './App.css';
import Header from "./components/header"
import { BrowserRouter as Router, Switch, Route} from "react-router-dom"
import Loading from './components/Loading';

const Login = React.lazy(() => import("./pages/Login"));
const ConfirmPin = React.lazy(() => import("./components/confirmPin"))
const SubscriptionPlan = React.lazy(() => import("./components/SubscriptionPlan"))
const TelcoPayment = React.lazy(() => import("./components/telcoPay"))
const SendPin = React.lazy(() => import("./components/sendPin"))
const WelcomeSubscribe = React.lazy(() => import("./components/welcomeSubcribe"))

function App() {
  return (
    <>
      
    <div className='container'>
      <Suspense fallback={<div><Loading/></div>}>
      <Router>
      <Header />
        <Switch>
        <Route exact path="/" render={() =>  <Login/>} />
        <Route path="/verifypin" render={() =>  <ConfirmPin/>} />
        <Route path="/subscription-plan/:phoneNumber" render={() =>  <SubscriptionPlan/>} />
        <Route path="/subscription/:phoneNumber/:appName" render={(props) =>  <SubscriptionPlan {...props}/>} />
        <Route path="/subscription/:phoneNumber/:appName/:inviterToken" render={(props) =>  <SubscriptionPlan {...props}/>} />
        <Route path="/payment-options" render={() =>  <TelcoPayment/>} />
        <Route path="/sendpin" render={() =>  <SendPin/>} />
        <Route path="/success" render={() =>  <WelcomeSubscribe/>} />
        
        {/* {routes.map((route, i) => {
          console.log("dsfd",route, i)
          return(
            <Route
              key={i}
              exact
              path={route.path}
              component={withRouter(route.Component)}
            />
          )}
        )} */}
        </Switch>
      </Router>
      </Suspense>
    </div>
    </>
  );
}

export default App;
