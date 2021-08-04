import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import Link from '@material-ui/core/Link';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import GitHubIcon from '@material-ui/icons/GitHub';
import BrushIcon from '@material-ui/icons/Brush';
import { NavLink } from 'react-router-dom'


export const mainListItems = (
    <div>
        <NavLink exact to="/words">
        <ListItem button>
            <ListItemIcon>
                <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="聊聊" />
        </ListItem>
        </NavLink>
        <NavLink exact to="/doodle">
        <ListItem button>
            <ListItemIcon>
                <BrushIcon />
            </ListItemIcon>
            <ListItemText primary="画画" />
        </ListItem>
        </NavLink>
        <NavLink exact to="/listen">
        <ListItem button>
            <ListItemIcon>
                <MusicNoteIcon />
            </ListItemIcon>
            <ListItemText primary="听听" />
        </ListItem>
        </NavLink>
    </div>
);

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
