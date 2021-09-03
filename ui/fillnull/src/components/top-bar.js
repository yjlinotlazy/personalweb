import React from 'react';
import { makeStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const theme = createTheme({
  typography: {
      h1: {
        fontSize: 26,
        textAlign: "center",
      },
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontSize: 22,
    fontWeight: "bolder",
  },
}));

export default function TopBar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#c7c7c7', color: '#403f3c', weight: 'bolder'}}>
        <Toolbar>
        <ThemeProvider theme={theme}>
          <Typography variant="h1" className={classes.title}>
            {props.title}
          </Typography>
          {props.onClick && <Button style={{background:"#e0f0bd"}} onClick={props.onClick} color="inherit">我有灵感</Button>}
          {props.onCancel && <Button style={{background:"#f0e0bd"}} onClick={props.onCancel} color="inherit">算了不说了</Button>}
          {props.onUpdate && <Button style={{background:"#f3f7df"}} onClick={props.onUpdate} color="inherit">再想想</Button>}
          {props.onDelete && <Button style={{background:"#a2a39e"}} onClick={props.onDelete} color="inherit">忘掉</Button>}
          {props.onBack && <Button style={{background:"#c1e6f5"}} onClick={props.onBack} color="inherit">回去</Button>}
          </ThemeProvider>
        </Toolbar>
      </AppBar>
    </div>
  );
}
