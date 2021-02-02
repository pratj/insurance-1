import MenuAppBar from "./AppBar";
import { DragDrop } from "./DragNDrop.styles";
import AppBar from "./AppBar";
import DragNDrop from "./DragNDrop";
import { ErrorBoundary } from "react-error-boundary";
import AlertDialog from "./components/AlertDialog";
import React, { useState } from "react";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      //minWidth: 275,
      maxWidth: 800,
      margintTop: "100px"
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 24,
    },
    pos: {
      marginBottom: 12,
    },
  });

function ErrorFallback({ error, resetErrorBoundary }) {
    const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div role="alert" style={{textAlign:"center", marginLeft:"25%", marginTop:"20%"}}>
        <Card className={classes.root} >
        <CardContent>
        <Typography className={classes.title}  color="textSecondary" gutterBottom>
        Something went wrong
        </Typography>
      <p></p>
      {console.log("ERROR IS CAUGHT ")}
      <pre>
        Please check the config File. Seems like you have an error in the File.
      </pre>
      <br></br>
      <br></br>
      <Button variant="outlined" color="primary" onClick={resetErrorBoundary}>Try again</Button>
      </CardContent>
      </Card>
    </div>
  );
}
function Dashboard() {
  return (
    <>
      <AppBar />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
          //  config == undefined
        }}
      >
        <DragNDrop />
      </ErrorBoundary>
    </>
  );
}
export default Dashboard;