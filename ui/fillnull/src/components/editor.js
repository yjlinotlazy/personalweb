import React, { useState, useEffect } from 'react';
import TopBar from './top-bar';
import Container from '@material-ui/core/Container';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory, useParams, useLocation} from "react-router-dom";
import { useForm } from "react-hook-form";
import { Server } from "../service/remote-server";
import Alert from '@material-ui/lab/Alert';
import { ImageUploader } from './image-uploader';
import { PageState } from '../constants';
import AttachmentViewer from './attachments-viewer';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    paddingTop: 10,
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


function Editor(props) {
    const classes = useStyles();
    const location = useLocation();
    const { type } = useParams();
    const hist = useHistory();
    const [error, setError] = useState("");
    const [initialValues, setInitialValues] = useState({});
    const [pageState, setPageState] = useState(PageState.Loading);
    const initState = location.state;
    const [images, setImages] = useState(initState ? initState.images : []);

    useEffect(() => {
        console.log("use effect")
        if (initState) {
            const initialValues = {
                title: initState.title,
                content: initState.content,
                articleId: initState.articleId,
            };
            setInitialValues(initialValues);
        }
    }, [images, initState]);

    const handleImageChangeStatus = ({ meta, file, xhr, remove }, status) => {
        if (status === 'done') {
            const response = JSON.parse(xhr.response);
            setPageState(PageState.Loaded);
            setImages([...images, response]);
            remove();
        } else if (status !== "removed") {
            setPageState(PageState.Uploading);
        }
    }

    const onRemove = (imageId) => {
        setPageState(PageState.Uploading);
        const payload = {
            images: images.filter((image) => image.imageId === imageId)
        }
        Server.image.delete(payload)
            .then((response) => {
                setImages(images.filter((image) => image.imageId !== imageId));
                setPageState(PageState.Loaded);
            })
            .catch((e) => {
                console.log(e);
                setPageState(PageState.Loaded);
            })
    }

    const {
        register,
        handleSubmit,
    } = useForm();

    const onSubmit = (data, e) => {
        if (pageState === PageState.Uploading) {
            setError("Please try again after all images have been uploaded");
        } else {
            let serviceCall = undefined;
            if (location.pathname.split("/")[1] === "update") {
                const payload = {
                    articleId: initialValues.articleId,
                    title: data.title || initialValues.title,
                    content: data.content || initialValues.content,
                    attachments: images,
                };
                serviceCall = Server.article.update(payload);
            } else {
                const payload = {
                    category: type,
                    title: data.title,
                    filename: data.filename,
                    content: data.content,
                    attachments: images,
                };
                serviceCall = Server.article.create(payload);
            }
            serviceCall
                .then((response) => {
                    console.log("Submitted!", response);
                    hist.goBack();
                })
                .catch((e) => {
                    console.log("Failed!", e);
                    setError(e.data.detail);
                })
        }
    };
    const onCancel = (e) => {
        const payload = {
            images: images
        }
        if (location.pathname.split("/")[1] !== "update") {
            Server.image.delete(payload)
                .then((response) => {
                    setImages([]);
                    hist.goBack();
                })
                .catch((e) => {
                    console.log(e);
                })
        } else {
            hist.goBack();
        }
    }

    const showAlert = (error !== "");
    return (
        <div>
        <TopBar title="新建" onCancel={onCancel}/>
        <Container maxWidth="md">
        {
        showAlert &&
        <div className={classes.root}>
        <Alert severity="error" variant="filled" onClose={() => {setError("")}}>{error}</Alert>
        </div>
        }
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>+</label>
            <input
                defaultValue={initialValues.title}
                placeholder="标题"
                required
                type="text" {...register("title")} />
            <input
            style={{ display: "inline", marginTop: 0 }}
                type="text"
                defaultValue={initialValues.filename}
                disabled={location.pathname.split("/")[1] === "update"}
                placeholder="文件名（不填也行）" {...register("filename")} />
            <textarea
                rows="15"
                required
                defaultValue={initialValues.content}
                placeholder="内容" {...register("content")}/>
            <input
                style={{ display: "inline", marginTop: 0 }}
                type="submit" value="想清楚了"/>
            <input
                style={{ display: "inline", marginTop: 0 }}
                type="reset"
                value="砍掉重练"
            />
            </form>
            <ImageUploader handleChangeStatus={handleImageChangeStatus}/>
            <AttachmentViewer images={images} onRemove={onRemove}/>
        </Container>
        </div>
    );
};

export default Editor;
