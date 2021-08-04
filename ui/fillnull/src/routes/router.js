import React from "react"
import {Switch, Route } from "react-router-dom";
import { About } from "../components/about";
import { Doodle } from "../components/doodle";
import { Words } from "../components/words";
import { Listen } from "../components/listen";

function Router() {
    return (
        <Switch>
            <Route exact path="/" render={() => <About />}/>
            <Route exact path="/about" render={() => <About />}/>
            <Route exact path="/doodle" render={() => <Doodle />}/>
            <Route exact path="/listen" render={() => <Listen />}/>
            <Route exact path="/words" render={() => <Words />}/>
        </Switch>
    )
}

export default Router;
