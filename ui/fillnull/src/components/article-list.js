import React, { useState, useEffect } from 'react';
import TopBar from './top-bar';
import Container from '@material-ui/core/Container';
import '../App.css';
import {useHistory} from "react-router-dom";
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { NavLink } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: 0,
  },
}));


export default function ArticleList({ title, category }) {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const hist = useHistory();
    const onClick = (e) => {
        hist.push(`/create/${category}`)
    }

    const classes = useStyles();
      const [open, setOpen] = React.useState(true);

      const handleClick = () => {
        setOpen(!open);
      };

    useEffect(() => {
        let mounted = true;
        Server.article
            .getAll(category)
            .then((response) => {
                if(mounted) {
                    const articles_data = response.data.articles.filter((item) => item.status !== "deleted")
                    const subCat_data = response.data.subcategories
                    subCat_data.sort(function(a, b) {
                        return a.ranking - b.ranking;
                    });
                    const merged = {};
                    subCat_data.forEach((subCat) => {
                        merged[subCat.subcategory_id] = {
                            title: subCat.title,
                            articles: articles_data.filter((item) => item.subcategory_id === subCat.subcategory_id)
                        }
                    })
                    setArticles(merged)
                    setLoading(false)
                }
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setArticles([]);
                if (mounted) {
                    setLoading(false);
                    setArticles([]);
                }
            })
    }, [category])

    const makeSubsection = (items) => {
        const merged = [];
        for (const [key, value] of Object.entries(items)) {
            merged.push(
            <React.Fragment key={key}>
                <ListItem button onClick={handleClick}>
                <ListItemText primary=<React.Fragment><h3>{value.title}</h3></React.Fragment> />
                {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {makeArticles(value.articles)}
                </List>
                </Collapse>
            </React.Fragment>
            )
        }
        return merged
    }

    const makeArticles = (items) => {
        const merged = [];
        items.forEach((item) => {
        const path = `/${category}/${item.article_id}`;
        const linkText = `${item.title}  (${item.created})`;
            merged.push(
            <React.Fragment key={item.article_id}>
                <ListItem button className={classes.nested}>
                    <NavLink exact to={path}>
                    {(item.thumb) && <img src={item.thumb} alt=""/>}
                    {linkText}
                    </NavLink>
                </ListItem>
            </React.Fragment>
            )
        })
        return merged
    }

    if (!loading) {
        return (
            <div>
            <TopBar title={title} onClick={onClick}/>
            <Container maxWidth="sm" className="main">
            <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  className={classes.root}
                >
                  {makeSubsection(articles)}
            </List>
            </Container>
            </div>
        );
    } else {
        return (
        <div>
            <TopBar title={title} onClick={onClick}/>
            <Container maxWidth="sm" className="main">
                <CircularProgress />
            </Container>
        </div>
        )
    }
};
