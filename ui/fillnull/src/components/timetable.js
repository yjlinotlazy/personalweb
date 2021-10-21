import React, {useEffect, useState} from 'react';
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Box from '@mui/material/Box';

function Timetable({journalId, date}) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [timetableTime, setTimetableTime] = useState([]);
    const [timetableTitle, setTimetableTitle] = useState([]);
    useEffect(() => {
        let mounted = true;
        Server.timetable.get(journalId)
            .then((response) => {
                const timetableItems = response.data.items;
                if(mounted) {
                    console.log(timetableItems)
                    setItems(timetableItems)
                }
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }, [])

    const refresh = () => {
        setLoading(true)
        Server.timetable.get(journalId)
            .then((response) => {
                setItems(response.data.items)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }

    const deleteTimetableItem = (itemId) => {
        Server.timetable.delete(itemId)
            .then((response) => {
                setLoading(false)
                refresh()
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }

    const onCreateTimetableItem = (e) => {
        setLoading(true);
        Server.timetable.post({
            journalId: journalId,
            date: date,
            time: timetableTime,
            title: timetableTitle,
        }).then((response) => {
            setLoading(false)
            refresh()
        }).catch((e) => {
            setLoading(false)
            console.log(e)
        })
    }

    if (loading) {
        return (
           <React.Fragment>
               <CircularProgress />
           </React.Fragment>
        )
    } else {
        return (
            <div className="timetable">
           <TextField
           style={{ display: "inline", marginTop: 0 }}
           variant="standard"
               placeholder='时间'
               type='text'
               value={timetableTime}
               onChange={(e) => setTimetableTime(e.target.value)}
               className='textfield'
               size='medium'
           />
           <TextField
           style={{ display: "inline", marginTop: 0 }}
           variant="standard"
               placeholder='课程'
               type='text'
               value={timetableTitle}
               onChange={(e) => setTimetableTitle(e.target.value)}
               className='textfield'
               size='medium'
           />
               <AddCircleRoundedIcon
               onClick={onCreateTimetableItem}
               style={{ display: "inline", marginTop: 0 }}
               />
               {items ?
                   items.map((item, index) =>
                       <li key={item.timetable_id} className="list" key={index} id={index}>
                       <h4>{item.time} {item.title}</h4>
                       <HighlightOffRoundedIcon
                           className='icon'
                           onClick={() => deleteTimetableItem(item.timetable_id)}
                           fontSize='medium'
                       />
                       </li>
                   )
                   : ''}
           </div>
        )
    }
}

export default Timetable