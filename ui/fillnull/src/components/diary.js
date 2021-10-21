import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import Container from '@material-ui/core/Container';
import {useHistory, useParams, useLocation } from "react-router-dom";
import {FileServer} from '../service/file-server';
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import rehypeRaw from 'rehype-raw';

function Diary({articleId}) {
    const [loading, setLoading] = useState(true);
    const hist = useHistory();
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [thumb, setThumb] = useState("");
    const [article, setArticle] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [images, setImages] = useState([]);
    const [created, setCreated] = useState("");
    const category = location.pathname.split("/")[1];


    useEffect(() => {
        console.log("loading diary", articleId)
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
                            setThumb(articleInfo.thumb);
                            setImages(articleInfo.attachments);
                            setSubcategoryId(articleInfo.subcategoryId);
                            setCreated(articleInfo.created);
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
            <React.Fragment>

                <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    children={article}
                >
                </ReactMarkdown>
            </React.Fragment>
        );
    } else {
       return (
       <div>
           <Container maxWidth="sm" className="main">
               <CircularProgress />
           </Container>
       </div>
       )
   }
};

export default Diary;
