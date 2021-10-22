import React from "react";
import NavigationDrawer from "./components/navigation-drawer"
import Router from './routes/router'
import {makeStyles, CssBaseline } from "@material-ui/core";
import {Config} from './config';

const useStyle = makeStyles(theme => ({
    root: {
        padding: "0",
        margin: "0",
        display: "flex",
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.behindBackground,

    },
    toolbar: {
        ...theme.mixins.toolbar,
    },

}));

function LandingPage() {
    const classes = useStyle();
    return (
        <div className={classes.root}>
            <CssBaseline/>

            { Config.user !== "family" && <NavigationDrawer mobileOpen={false}/>}

            <div className={classes.content}>
                <Router className={classes.root}/>
            </div>
        </div>
    );
}


export default LandingPage;
