import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import {Config} from '../config';
import '../App.css';
import Button from "@material-ui/core/Button";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CircularProgress from '@material-ui/core/CircularProgress';


const Preview = ({ meta, cancel, remove }) => {
    const { percent, status } = meta

    return (
        <div className="img-with-text">
        <img src={meta.previewUrl} align="left" alt=""/><br/>
        {Math.round(percent)}%, {status === "done" ? <CheckCircleIcon /> : <CircularProgress />}
        { status === "done" ? <Button onClick={remove}>Remove</Button> : <Button onClick={cancel}>Cancel</Button>}
        </div>
    )
}

export const ImageUploader = (props) => {
    // specify upload params and url for your files
    const getUploadParams = ({ meta, file }) => {
        console.log("file", file, meta)
        const split = meta.previewUrl.split("/");
        const filename = split[split.length - 1];
        return {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                'type': file.type,
                'name': filename,
                'user': Config.user,
            },
            url: Config.serverUrl + 'image/upload',
        }
    }

    return (
        <Dropzone
            getUploadParams={getUploadParams}
            style={{"width" : "100%", "height" : "20%", "border" : "1px solid black"}}
            PreviewComponent={Preview}
            inputContent="天价图片"
            canRemove={true}
            onChangeStatus={props.handleChangeStatus}
            accept="image/*,audio/*,video/*"
        />
    )
}
