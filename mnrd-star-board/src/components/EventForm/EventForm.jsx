//imports
import 'date-fns';
import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

//styling for the MNRD colored button
const useStyles = makeStyles({
    root: {
      background: '#00B6F1',
    },
  });


function EventForm() {
    let history = useHistory();
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [photoURL, setPhotoURL] = useState('');
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setDescription(event.target.value);
      };
    
    // const handleURL = (event) => {
    //     setPhotoURL(event.target.value);
    // };

    const handleSubmit = () =>{
        const postObject = {
            description: description,
            date: selectedDate,
            photoURL: photoURL,
        }
       // alert(`button clicked! ` + postObject.description + postObject.date + postObject.photoURL);
        dispatch({type: "POST_ACTIVITY", payload: postObject})
        history.push("/starField");
    }

    return (
      <div>
        <div className = "spacer"> </div>
        <img src="https://www.mnrollerderby.com/wp-content/uploads/2019/08/minnesota-roller-derby-logo-card.png" className="App-logo" alt="logo" />
        <h1>Log your Practice or Activity!</h1>
        <Grid container justify="space-around">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {/* Date Picker */}
                <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Practice Date"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    KeyboardButtonProps={{
                        'aria-label': 'change date',
                }}
                />
            </MuiPickersUtilsProvider>
            {/* Description */}
            <TextField
                id="description"
                label="What did you do?"
                placeholder="Virtual Workout with a 30 lb kettlebell!"
                multiline
                value = {description}
                onChange = {handleChange}
            />
            {/* Photo URL  - currently unused in code TODO - replace with Uppy */}
            {/* <TextField
                id="photoURL"
                label="Add a photo URL:"
                multiline
                value = {photoURL}
                onChange = {handleURL}
            /> */}
        </Grid>
        <br/>
        <Button variant = 'contained' className={classes.root} onClick={handleSubmit} > 
            Save Activity
        </Button>
      </div>
    );
  }
  
  export default EventForm;