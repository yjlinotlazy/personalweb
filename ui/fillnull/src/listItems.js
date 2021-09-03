import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import GitHubIcon from '@material-ui/icons/GitHub';
import { NavLink } from 'react-router-dom'


const makeItem = (path, title) => {
    return (
    <NavLink exact to={path}>
    <ListItem button>
        <ListItemIcon>
            <DescriptionIcon />
        </ListItemIcon>
        <ListItemText primary={title} />
    </ListItem>
    </NavLink>
    )
}

export const mainListItems = {
    demo: (
        <div>
            {makeItem("/", "首页")}
            {makeItem("/words", "聊聊")}
        </div>
    ),
    prod: (
        <div>
            {makeItem("/", "首页")}
            {makeItem("/words", "聊聊")}
            {makeItem("/doodle", "画画")}
            {makeItem("/listen", "听听")}
        </div>
    ),
    family: (
        <div>
            {makeItem("/", "首页")}
            {makeItem("/dairy", "家图")}
        </div>
    )
};



export const secondaryListItems = (
    <div>
        <NavLink exact to="/about">
        <ListItem button>
            <ListItemIcon>
                <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="关于" />
        </ListItem>
        </NavLink>
        <Link href="https://github.com/yjlinotlazy" color="inherit" target="_blank" rel="noreferrer">
        <ListItem button>
            <ListItemIcon>
                <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary="github" />
        </ListItem>
        </Link>
    </div>
);
