import React, {useEffect, useState} from 'react';
import {Server} from '../service/remote-server';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
// import EditIcon from '@mui/icons-material/Edit';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { TextField } from '@material-ui/core';


function TodoTable({journalId, date}) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [todoTitle, setTodoTitle] = useState([]);
    useEffect(() => {
        let mounted = true;
        Server.todo.get(journalId)
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
        Server.todo.get(journalId)
            .then((response) => {
                setItems(response.data.items)
                setLoading(false)
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }

    const deleteTodo = (itemId) => {
        Server.todo.delete(itemId)
            .then((response) => {
                setLoading(false)
                refresh()
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }
    const toggleTodo = (itemId) => {
        Server.todo.toggle(itemId)
            .then((response) => {
                setLoading(false)
                refresh()
            })
            .catch((e) => {
                setLoading(false)
                console.log(e);
            })
    }


    const onCreateTodoItem = (e) => {
        setLoading(true);
        Server.todo.create({
            journalId: journalId,
            created: date,
            title: todoTitle,
        }).then((response) => {
            setLoading(false)
            setTodoTitle("");
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
           variant="standard"
               placeholder='TODO'
               type='text'
               value={todoTitle}
               onChange={(e) => setTodoTitle(e.target.value)}
               className='textfield'
               size='medium'
           />
               <AddCircleRoundedIcon
               onClick={onCreateTodoItem}
               style={{ display: "inline", marginTop: 0 }}
               />
               {items ?
                   items.map((item, index) =>
                       <li key={item.todo_id} className="list" id={index}>
                       <HighlightOffRoundedIcon
                           className='icon'
                           onClick={() => deleteTodo(item.todo_id)}
                           fontSize='medium'
                       />
                       {item.completed !== "0000-00-00" &&
                           <RadioButtonUncheckedIcon
                           className='icon'
                           onClick={() => toggleTodo(item.todo_id)}
                           fontSize='medium'
                           />
                       }
                       {item.completed === "0000-00-00" &&
                           <CheckCircleOutlineIcon
                           className='icon'
                           onClick={() => toggleTodo(item.todo_id)}
                           fontSize='medium'
                           />
                       }

                       <h5>{item.time} {item.title}</h5>
                       </li>
                   )
                   : ''}
           </div>
        )
    }
}

export default TodoTable