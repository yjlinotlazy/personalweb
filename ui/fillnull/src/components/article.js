import React, {useEffect, useState} from 'react';
import TopBar from './top-bar';
import ReactMarkdown from 'react-markdown';
import Container from '@material-ui/core/Container';
import '../App.css';
import {useHistory, useParams, useLocation } from "react-router-dom";
import {FileServer} from '../service/file-server';
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import rehypeRaw from 'rehype-raw';

function Article(match) {
    const [loading, setLoading] = useState(true);
    const hist = useHistory();
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [article, setArticle] = useState("");
    const [images, setImages] = useState([]);
    const { articleId } = useParams();
    const category = location.pathname.split("/")[1];

    const onBack = (e) => {
        hist.push(`/${category}`);
    }

    const onDelete = (e) => {
        Server.article.delete(articleId);
        hist.push(`/${category}`);
    }

    const onUpdate = (e) => {
        hist.push({
            pathname: `/update`,
            state: {
                title: title,
                content: article,
                articleId: articleId,
                category: category,
                images: images,
            }
        })
    }

    useEffect(() => {
        console.log("use effect")
        let mounted = true;
        Server.article.get(articleId)
            .then((response) => {
                const articleInfo = response.data;
                FileServer.file
                    .getText(category, articleInfo.filename)
                    .then((response) => {
                        if(mounted) {
                            setTitle(articleInfo.title);
                            setArticle(response.data);
                            setImages(articleInfo.attachments);
                        }
                    })
                    .catch((e) => console.log(e));
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }, [category, articleId])

    if (!loading) {
        return (
            <div>
            <TopBar title={title} onBack={onBack} onDelete={onDelete} onUpdate={onUpdate}/>
             <Container maxWidth="md" className="main">
            <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            >
              {article}
            </ReactMarkdown>
            < /Container>
            </div>
        );
    } else {
       return (
       <div>
           <TopBar title={title} onBack={onBack} />
           <Container maxWidth="sm" className="main">
               <CircularProgress />
           </Container>
       </div>
       )
   }
};

export default Article;
