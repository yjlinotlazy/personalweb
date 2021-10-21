import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import GitHubIcon from '@material-ui/icons/GitHub';
import { NavLink } from 'react-router-dom'
import BrushIcon from '@material-ui/icons/Brush';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import HomeIcon from '@material-ui/icons/Home';


const makeItem = (path, title, icon="default") => {
    let iconItem;
    switch (icon) {
        case "paint":
            iconItem = (<BrushIcon />)
            break;
        case "music":
            iconItem = (<MusicNoteIcon />)
            break;
        case "home":
            iconItem = (<HomeIcon />)
            break;
        default:
            iconItem = (<DescriptionIcon />)
            break
    }
    return (
    <NavLink exact to={path}>
    <ListItem button>
        <ListItemIcon>
            {iconItem}
        </ListItemIcon>
        <ListItemText primary={title} />
    </ListItem>
    </NavLink>
    )
}

export const mainListItems = {
    demo: (
        <div>
            {makeItem("/", "首页", "home")}
            {makeItem("/words", "聊聊")}
            {makeItem("/journal", "journal")}
        </div>
    ),
    prod: (
        <div>
            {makeItem("/", "首页", "home")}
            {makeItem("/words", "聊聊")}
            {makeItem("/doodle", "画画", "paint")}
            {makeItem("/listen", "听听", "music")}
        </div>
    ),
    family: (
        <div>
            {makeItem("/", "首页", "home")}
            {makeItem("/journal", "家图")}
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
