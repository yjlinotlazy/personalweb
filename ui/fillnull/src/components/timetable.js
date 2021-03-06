import React, {useEffect, useState} from 'react';
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import { TextField } from '@material-ui/core';


function Timetable({journalId, date}) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [timetableTime, setTimetableTime] = useState([]);
    const [timetableTitle, setTimetableTitle] = useState([]);
    useEffect(() => {
        let mounted = true;
        Server.timetable.get(journalId)
            .then((response) => {
                if(mounted) {
                    setItems(response.data.items)
                }
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }, [journalId, date])

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
            setTimetableTime("")
            setTimetableTitle("")
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
            <div
           style={{ backgroundColor: "#d4ecfc", marginTop: 0 }}>
           <TextField
           style={{ display: "inline", marginTop: 0 }}
           variant="standard"
               placeholder='??????'
               type='text'
               value={timetableTime}
               onChange={(e) => setTimetableTime(e.target.value)}
               className='textfield'
               size='medium'
           />
           <TextField
           style={{ display: "inline", marginTop: 0 }}
           variant="standard"
               placeholder='??????'
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
                       <li key={item.timetable_id} className="list" id={index}>
                       <HighlightOffRoundedIcon
                           className='icon'
                           onClick={() => deleteTimetableItem(item.timetable_id)}
                           fontSize='medium'
                       />
                       <h4>{item.time} {item.title}</h4>
                       </li>
                   )
                   : ''}
           </div>
        )
    }
}

export default Timetable