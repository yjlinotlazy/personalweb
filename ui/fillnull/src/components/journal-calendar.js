import React, { useState, useEffect } from "react";
import {useHistory} from "react-router-dom";
import {FileServer} from '../service/file-server';
import {Server} from '../service/remote-server';
import TopBar from './top-bar';
import Container from '@material-ui/core/Container';
import './journal-style.css';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import './Calender.css';
import DatePicker from "react-datepicker";
import Button from '@material-ui/core/Button';
import Diary from './diary';
import Timetable from './timetable';
import TodoTable from './todo';

import "react-datepicker/dist/react-datepicker.css";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
  },
  paper: {
    padding: 0,
    margin: 0,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


const JournalCalender = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [journalData, setJournalData] = useState({});
  const [selectedDay, setSelectedDay] = useState(new Date());
  const hist = useHistory();

  const onCreateDiary = (e) => {
     hist.push({
        pathname: `/create/journal`,
        state: {
            title: dateToString(selectedDay),
            content: "",
            articleId: -1,
            category: "journal",
            created: new Date(),
            subcategoryId: 13,
            images: [],
        }
     })
  }

  const onUpdateDiary = (e) => {
      Server.article.get(journalData.article_id)
      .then((response) => {
          const articleInfo = response.data;
          FileServer.file
              .getText("journal", articleInfo.filename)
              .then((response) => {
                  hist.push({
                        pathname: `/update`,
                        state: {
                            title: articleInfo.title,
                            content: response.data,
                            articleId: journalData.article_id,
                            category: "journal",
                            created: articleInfo.created,
                            subcategoryId: articleInfo.subcategoryId,
                            images: articleInfo.attachments,
                        }
                    })
              })
              .catch((e) => console.log(e));
      })
      .catch((e) => {
          console.log(e);
      })
  }

  const dateToString = (date) => {
    return date.toISOString().slice(0, 10).replace(/-/g,"");;
  }

  const loadJournal = (date) => {
    setLoading(true)
    Server.journal
        .get(dateToString(selectedDay))
        .then((response) => {
            setJournalData(response.data.journalInfo)
            setLoading(false);
        })
        .catch((e) => {
            console.log(e);
            setLoading(false);
        })
  }

  const onNewJournal = (date) => {
    const formattedDate = dateToString(date);
    setLoading(true)
    Server.journal
      .post(formattedDate)
      .then((response) => {
          loadJournal(date)
      })
      .catch((e) => {
          console.log(e);
          setLoading(false);
      })
  }
  useEffect(() => {
      let mounted = true;
      Server.journal
          .get(dateToString(selectedDay))
          .then((response) => {
              if(mounted) {
                  const journalData = response.data.journalInfo;
                  setJournalData(journalData)
                  setLoading(false)
              }
              setLoading(false);
          })
          .catch((e) => {
              console.log(e);
              if (mounted) {
                  setLoading(false);
              }
          })
      }, [selectedDay])

    if (loading) {
        return (
            <div>
                <Container maxWidth="sm" className="main">
                    <CircularProgress />
                </Container>
            </div>
            )
    } else if (journalData && Object.keys(journalData).length > 0) {
        let botton;
        if (journalData.article_id) {
            botton = (
              <React.Fragment>
                <Button style={{background:"#e0f0bd",display:"inline"}} onClick={onUpdateDiary} color="inherit">再想想</Button>
              </React.Fragment>
            )
        } else {
           botton = (
            <React.Fragment>
              <Button style={{background:"#f3f7df",display:"inline"}} onClick={onCreateDiary} color="inherit">我有灵感</Button>
            </React.Fragment>
          )
        }
        return (
            <div>
              <div>
                <Container maxWidth="sm" wrap='nowrap' align="center" display="inline">
                    <DatePicker style={{display:"inline"}} selected={selectedDay} onChange={(date) => setSelectedDay(date)} />
                </Container>
                <Container>
                <Grid container spacing={0}>
                  <Grid item xs={6}>
                    <Paper className={classes.paper}>
                    { journalData.article_id && <Diary articleId={journalData.article_id}></Diary> }
                    </Paper>
                    {botton}
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className="timetable">
                      <Timetable journalId={journalData.journal_id} date={dateToString(selectedDay)}/>
                    </Paper>
                    <Paper className="todo">
                      <TodoTable journalId={journalData.journal_id} date={dateToString(selectedDay)}/>
                    </Paper>
                  </Grid>
                 </Grid>
                </Container>
              </div>
            </div>
          );
    } else {
        return (
            <div>
              <div className="flex-container">

                <Container maxWidth="sm" className="main" align="center">
                    <DatePicker selected={selectedDay}onChange={(date) => setSelectedDay(date)} />
                </Container>
                <Container maxWidth="lg" className="main" align="center">
                <Button style={{background:"#e0f0bd"}} onClick={() => onNewJournal(selectedDay)} color="inherit"><h1>新的一天走起</h1></Button>
                </Container>
              </div>
            </div>
        );
    }

};

export default JournalCalender;