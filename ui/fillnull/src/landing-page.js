import React from "react";
import NavigationDrawer from "./components/navigation-drawer"
import Router from './routes/router'
import {makeStyles, CssBaseline } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";

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

            <NavigationDrawer/>

            <div className={classes.content}>
                {/*<div className={classes.toolbar}/>*/}
                <Router className={classes.root}/>
            </div>
            <Hidden only={['sm', 'md', 'lg', 'xl']}>
            </Hidden>
        </div>
    );
}


export default LandingPage;
