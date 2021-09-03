import React, { useState, useEffect } from 'react';
import TopBar from './top-bar';
import Container from '@material-ui/core/Container';
import '../App.css';
import {useHistory} from "react-router-dom";
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';


function Words() {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const hist = useHistory();
    const onClick = (e) => {
        hist.push("/create/words")
    }

    useEffect(() => {
        let mounted = true;
        Server.article
            .getAll('words')
            .then((response) => {
                if(mounted) {
                    setArticles(response.data.articles.filter((item) => item.status !== "deleted"))
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
    }, [])
    if (!loading) {
        return (
            <div>
            <TopBar title="聊聊" onClick={onClick}/>
            <Container maxWidth="sm" className="main">
            <ul>
            {articles.map((article) => (
              <li key={article.article_id}><a href={`/words/${article.article_id}`}>{article.title}</a> ({article.created})</li>
            ))}
            </ul>
            </Container>
            </div>
        );
    } else {
        return (
        <div>
            <TopBar title="聊聊" onClick={onClick}/>
            <Container maxWidth="sm" className="main">
                <CircularProgress />
            </Container>
        </div>
        )
    }
};

export default Words;
