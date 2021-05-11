import React from "react";
import axios from "axios";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import './styles.css';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const App = () => {
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    file: null
  });
  const [loading,setLoading]=React.useState(false);
  const [message,setMessage]=React.useState("");
  const [ResponseId,setResponseId]=React.useState("");
  const [open, setOpen] = React.useState(false);

 

  const handleClose = () => {
    setOpen(false);
  };
  function HandleChange(event) {

    const inputValue =
      event.target.name === "file" ? event.target.files[0] : event.target.value;
    setForm({
      ...form,
      [event.target.name]: inputValue
    });
  
  }
  function handleSubmit(event) {
    event.preventDefault();
    setMessage("Video is Being Processed and being uploaded to the youtube server");
    const videoData = new FormData();
    videoData.append("videoFile", form.file);
    videoData.append("title", form.title);
    videoData.append("description", form.description);
    videoData.append("id",Date.now());
    setLoading(true);
    axios.post("http://localhost:4000/upload", videoData).then((response) => {
      console.log(response);
     
      if(response.data.successcode===0){
          setMessage(response.data.message);
          setLoading(false);
      }
      else{
      setResponseId(response.data.status);
      
      setForm({title:"",description: "",file: null});
      setMessage("Response received");
      setOpen(true);
      setLoading(false);
      }
    });
  }
  const classes = useStyles();

  return (
    <div className="bg-secondary text-white container-fluid text-center">
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Response Received</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Hey user your video has been uploaded ...
            Here We are providing you the Youtube Video link that has been generated Through the response
            <br></br>
            <a href={"https://www.youtube.com/watch?v="+ResponseId} className="text-decoration-none btn btn-dark text-white"><b>{"https://www.youtube.com/watch?v="+ResponseId}</b></a>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        
          <Button onClick={handleClose} color="primary">
            close
          </Button>
        </DialogActions>
      </Dialog>
      <h1>Internship Task</h1>
      <h3>MERN stack-deep shah</h3>
      
      <br></br>
      <div className="row card border rounded-pill c">
      <form onSubmit={handleSubmit}>
        <br></br>
        <br></br>
        <br></br>
        <div className="pt-3">
        <label for="title" className="col-sm-2 col-form-label"><b>Enter Video Title</b></label>
          <input
            type="text"
            name="title"
            id="title"
            className="border rounded-pill"
            onChange={HandleChange}
            autoComplete="Off"
            placeholder="enter Title"
            required
          />
        </div>
        <div className="pt-3">
        <label for="description" className="col-sm-2 col-form-label"><b>Enter Video Description</b></label>
        
          <textarea
           
            onChange={HandleChange}
            name="description"
            id="description"
            autoComplete="Off"
            placeholder="Desciption for the video"
            rows="10"
            required
          ></textarea>
        </div>
        <div className="bg-dark border rounded-pill">
          <input
            type="file"
            onChange={HandleChange}
            accept="video/mp4"
            name="file"
            
            required
          />
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYtQXMRAqqfX72wuU-ZHZe6eml4Z0VVPQK7w&usqp=CAU" alt="videoicon" height="45" width="45"></img>
        </div>
        <button type="submit" className="mt-2 mb-4 btn btn-outline-primary text-dark">Upload Video</button>
      </form>
      </div>
      <div className="row bg-dark text-white text-center">
        <h2>Response:</h2>
        <h3>{message}</h3>
        <br></br>
        {loading===true?(
        
          <div className="text-center">
          <CircularProgress color="secondary" />
          </div>):("")}
        <h2>{ResponseId===""?("Your Response will appear here"):(
          <div>
            <a href={"https://www.youtube.com/watch?v="+ResponseId} className="text-decoration-none">Video Link({"https://www.youtube.com/watch?v="+ResponseId})</a>
          <br></br>
          
          </div>
        )}</h2></div>

    </div>
  );
};
export default App;
