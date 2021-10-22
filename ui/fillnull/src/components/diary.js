import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import Container from '@material-ui/core/Container';
import { useLocation } from "react-router-dom";
import {FileServer} from '../service/file-server';
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import rehypeRaw from 'rehype-raw';

function Diary({articleId}) {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [article, setArticle] = useState("");
    const category = location.pathname.split("/")[1];


    useEffect(() => {
        let mounted = true;
        Server.article.get(articleId)
            .then((response) => {
                const articleInfo = response.data;
                FileServer.file
                    .getText(category, articleInfo.filename)
                    .then((response) => {
                        if(mounted) {
                            setArticle(response.data);
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
            <div className="diary">
                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    children={article}
                >
                </ReactMarkdown>
            </div>
        );
    } else {
       return (
       <div>
           <Container maxWidth="sm" className="diary">
               <CircularProgress />
           </Container>
       </div>
       )
   }
};

export default Diary;
