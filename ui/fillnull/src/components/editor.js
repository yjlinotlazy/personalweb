import React, { useState, useEffect } from 'react';
import TopBar from './top-bar';
import Container from '@material-ui/core/Container';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory, useParams, useLocation} from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Server } from "../service/remote-server";
import Alert from '@mui/material/Alert';
import { ImageUploader } from './image-uploader';
import { PageState } from '../constants';
import AttachmentViewer from './attachments-viewer';
import PreviewMarkdown from './preview-markdown';
import { Select, MenuItem } from "@mui/material";
import DatePicker from 'react-datepicker';

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 120,
      },
      selectEmpty: {
          marginTop: theme.spacing(0),
        },
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
    const [preview, setPreview] = useState(false);
    const initState = location.state;
    const [images, setImages] = useState(initState ? initState.images : []);
    const [subCatOptions, setSubCatOptions] = useState([]);
    const [created, setCreated] = useState(new Date());

    useEffect(() => {
        setPageState(PageState.Loading);
        if (initState) {
            const initialValues = {
                title: initState.title,
                thumb: initState.thumb,
                content: initState.content,
                articleId: initState.articleId,
                subcategoryId: initState.subcategoryId,
                category: initState.category,
                created: initState.created,
            };
            setInitialValues(initialValues);
            setCreated(new Date(initState.created));
        }
        let mounted = true;
        Server.article
            .subCategories(type || initState.category)
            .then((response) => {
                if(mounted) {
                    const menu = []
                    response.data.subcategories.forEach((item) => {
                        menu.push(
                            <MenuItem key={item.subcategory_id} value={item.subcategory_id}>{item.title}</MenuItem>
                        )
                    })
                    setSubCatOptions(menu);
                    setPageState(PageState.Loaded)
                }
            })
            .catch((e) => {
                console.log(e);
                if (mounted) {
                    setPageState(PageState.LoadError)
                }
            })
    }, [images, initState, type]);

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
        control
    } = useForm();

    const onSubmit = (data, e) => {
        console.log(data)
        if (pageState === PageState.Uploading) {
            setError("Please try again after all images have been uploaded");
        } else {
            let serviceCall = undefined;
            if (location.pathname.split("/")[1] === "update") {
                const payload = {
                    articleId: initialValues.articleId,
                    title: data.title || initialValues.title,
                    thumb: data.thumb,
                    content: data.content || initialValues.content,
                    created: created,
                    subcategoryId: data.subcategoryId !== "0" ? data.subcategoryId: initialValues.subcategoryId,
                    attachments: images,
                };
                serviceCall = Server.article.update(payload);
            } else {
                const payload = {
                    category: type,
                    title: data.title || initialValues.title,
                    filename: data.filename,
                    thumb: data.thumb,
                    subcategoryId: data.subcategoryId || initialValues.subcategoryId,
                    content: data.content,
                    attachments: images,
                    created: created,
                };
                serviceCall = Server.article.create(payload);
            }
            serviceCall
                .then((response) => {
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

    const handlePreviewOpen = () => {
        setPreview(true);
    };

    const handlePreviewClose = () => {
        setPreview(false);
    };

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

            {(!pageState.Loading) && <Controller
                render={({ field }) => (
                <React.Fragment>
                  <Select {...field}>
                  <MenuItem value="0" disabled>
                              子类别
                            </MenuItem>
                    {subCatOptions}
                  </Select>
                  </React.Fragment>
                )}
                control={control}
                name="subcategoryId"
                defaultValue={initState ? initState.subcategoryId : "0"}
              />}
            <input
                defaultValue={initialValues.title}
                placeholder="标题"
                required
                type="text" {...register("title")} />
            <input
                defaultValue={initialValues.thumb}
                placeholder="缩略图"
                type="text" {...register("thumb")} />
            <DatePicker selected={created} onChange={(date) => setCreated(date)} />
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
            <PreviewMarkdown
                preview={preview}
                handlePreviewClose={handlePreviewClose}
            />
            </form>
            <ImageUploader handleChangeStatus={handleImageChangeStatus}/>
            <AttachmentViewer images={images} onRemove={onRemove}/>
        </Container>
        </div>
    );
};

export default Editor;
