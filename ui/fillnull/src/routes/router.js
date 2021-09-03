import React from "react"
import {Switch, Route } from "react-router-dom";
import { About } from "../components/about";
import { Main } from "../components/main";
import { Doodle } from "../components/doodle";
import Words from "../components/words";
import { Listen } from "../components/listen";
import Editor from "../components/editor";
import ProtectedRoute from "./protected-route";
import Signin from "../components/signin";
import Article from "../components/article";

function Router() {
    return (
        <Switch>
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/" component={Main} />
            <Route exact path="/about" component={About} />
            <Route exact path="/doodle" component={Doodle} />
            <Route exact path="/listen" component={Listen} />
            <Route exact path="/words" component={Words} />
            <Route path="/words/:articleId" component={Article} />
            <ProtectedRoute path="/create/:type" component={Editor} />
            <ProtectedRoute path="/update" component={Editor} />
        </Switch>
    )
}

export default Router;
