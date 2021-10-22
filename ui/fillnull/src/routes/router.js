import React from "react"
import {Switch, Route } from "react-router-dom";
import { About } from "../components/about";
import { Main } from "../components/main";
import Editor from "../components/editor";
import ProtectedRoute from "./protected-route";
import Signin from "../components/signin";
import Article from "../components/article";
import ArticleList from "../components/article-list";
import JournalCalender from "../components/journal-calendar";

function Router() {
    return (
        <Switch>
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/" component={Main} />
            <Route exact path="/about" component={About} />
            <Route exact path="/doodle" component={() => <ArticleList title="画画" category="doodle"/>} />
            <Route exact path="/listen" component={() => <ArticleList title="听听" category="listen"/>} />
            <Route exact path="/words" component={() => <ArticleList title="聊聊" category="words"/>} />
            <ProtectedRoute exact path="/journal" component={() => <JournalCalender title="图日记" category="journal"/>} />
            <Route path="/words/:articleId" component={Article} />
            <Route path="/listen/:articleId" component={Article} />
            <Route path="/doodle/:articleId" component={Article} />
            <ProtectedRoute path="/journal/:articleId" component={Article} />
            <ProtectedRoute exact path="/create/:type" component={Editor} />
            <ProtectedRoute exact path="/update" component={Editor} />
        </Switch>
    )
}

export default Router;
