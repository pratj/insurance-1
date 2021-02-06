import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import BuildOutlinedIcon from "@material-ui/icons/BuildOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useForm } from "react-hook-form";
import AlertDialog from "./AlertDialog.js";
import routeConstants from "../shared/constants/routes";

const { LOGIN, SIGNUP } = routeConstants;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.warning.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function onSubmit(data) {
    try {
      console.log(data.emailId);
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(data.emailId);

      setMessage("Check your inbox for further instructions");
      handleClickOpen();
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <Container component="main" maxWidth="xs" className="login">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <BuildOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <AlertDialog
          openState={open}
          setOpenPopup={setOpen}
          title={"Email Sent"}
          content={
            "Follow the instructions sent on your email to reset password! "
          }
          button={"Okay"}
        />
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            inputRef={register({ required: true })}
            required
            fullWidth
            id="emailId"
            label="Email Address"
            name="emailId"
            // autoComplete="email"
            autoFocus
          />
          {errors.emailId && <span>This field is required</span>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Reset Password
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to={LOGIN.route} variant="body2">
                Login
              </Link>
            </Grid>
            <Grid item>
              <Link to={SIGNUP.route} variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
