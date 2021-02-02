import React, { useRef, useState } from "react"

import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
//import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useForm} from 'react-hook-form'
import AlertDialog from './AlertDialog.js'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: "gold",
      

    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      backgroundColor: theme.palette.success.dark,
    },
  }));

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const classes = useStyles();
  const {register, handleSubmit, errors} = useForm()

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [openAlert, setOpenAlert] = React.useState(false);

  const handleClickOpenAlert = () => {
    setOpen(true);
  };

  const handleCloseAlert = () => {
    setOpen(false);
  };

  async function onSubmit(data) {
    

    try {
      setError("")
      setLoading(true)
      //await login(emailRef.current.value, passwordRef.current.value)
      await login(data.emailId, data.password)
      handleClickOpenAlert()
      history.push("/home")
      
    } catch {
      setError("Failed to log in")
      console.log("ERROR LOGIN",error)
      handleClickOpen()
    }

    setLoading(false)
  }

  return (
    
      <Container component="main" maxWidth="xs" className="login">
      <CssBaseline />
      <div className={classes.paper}>
        <img src="favicon.ico" style={{width:"50px",height:"50px"}}/>
        {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <AlertDialog openState={open} setOpenPopup={setOpen} title={"Wrong Credentials"} content={"Your Password or Email was wrong! "} button={"Try Again"}/>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleCloseAlert} severity="error">
          Sorry Try Again
        </Alert>
      </Snackbar>
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register({ required: true})}
            required
            fullWidth
            id="emailId"
            label="Email Address"
            name="emailId"
            // autoComplete="email"
            autoFocus
          />
          {errors.emailId && <span>This field is required</span>}
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register({ register: true})}
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {errors.password && <span>This field is required</span>}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Login
          </Button>
          
          <Grid container>
            <Grid item xs>
              <Link to="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link to="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
    
  )
}