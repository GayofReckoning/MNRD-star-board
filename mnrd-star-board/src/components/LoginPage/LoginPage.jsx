//imports
import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from "react-router-dom";

//styling for the MNRD colored button
const useStyles = makeStyles({
    root: {
      background: '#00B6F1',
    },
    error:{
        color: '#EF3340'
    }
  });


function LoginPage() {
    let history = useHistory();
    const classes = useStyles();
    const [Name, setName] = useState('');
    const [Password, setPassword] = useState ('');
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors);

    const handleChangeName = (event) => {
        setName(event.target.value)
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = () => {
        const loginObject = {
            name: Name,
            password: Password
        }
        if(!Name||!Password){
            dispatch({ type: 'LOGIN_INPUT_ERROR' });
            return
        }
        console.log(loginObject);
         //dispatch login saga HERE
         dispatch({ type: "LOGIN", payload: loginObject })
        //nest this after returned promise, tho
        history.push("/form");
    }

    const handleNewUser = () => {
        // go to register page here!
        dispatch({type:'SET_TO_REGISTER_MODE'});
    }

    return (
      <div>
        <div className = "spacer"> </div>
        <h1>Log in to StarBoard </h1>
        <Grid container justify="space-around" direction = "column" spacing = {2}>
            <Grid item>
                <TextField label = "name" value = {Name} onChange = {handleChangeName}/>
            </Grid>
            <Grid item>
                <TextField type = "password" label = "password" value = {Password} onChange = {handleChangePassword}/> 
            </Grid>
            <br/>
            <Grid container item direction = "row" justify = "center" alignItems = "center" spacing = {4}>
                <Grid item>
                    <Button variant = 'contained' className={classes.root} onClick={handleLogin}> 
                        Log in
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant = 'contained' className={classes.root} onClick = {handleNewUser}> 
                        New User?
                    </Button>
                </Grid>
            </Grid>
            {errors.loginMessage && <em className = {classes.error}>{errors.loginMessage}</em>}
        </Grid>
      </div>
    );
  }
  
  export default LoginPage;