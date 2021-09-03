import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import IconButton from '@material-ui/core/IconButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CancelIcon from '@material-ui/icons/Cancel';
import {Config} from '../config';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    width: "100%",
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));


export default function AttachmentViewer(props) {
    const classes = useStyles();
    const itemData = props.images.map((item) => {
        return {
            id: item.imageId,
            img: `${Config.ftpUrl}${Config.user}/images/${item.filename}`,
            title: item.imageId,
            author: 'author',
        }
    })

    const copyText = (e) => {
        const el = document.createElement('textarea');
        const text = `<img src="${e}" width="90%" alt=""/>`
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    const onRemove = (e) => {
        props.onRemove(e);
    }

  return (
    <div className={classes.root}>
      <ImageList rowHeight={180} className={classes.imageList} cols={3}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img src={item.img} alt={item.title} />
            <ImageListItemBar

              actionIcon={
              <React.Fragment>
                <IconButton onClick={e => copyText(item.img)} value={item.img} className={classes.icon}>
                  <FileCopyIcon/>
                </IconButton>

                <IconButton onClick={e => onRemove(item.id)} value={item.id} className={classes.icon}>
                  <CancelIcon color="secondary"/>
                </IconButton>
                </React.Fragment>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}