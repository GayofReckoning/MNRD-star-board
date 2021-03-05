//imports
import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select'

//constants
//styling for the MNRD colored button
const useStyles = makeStyles({
    root: {
      background: '#00B6F1',
    },
    formWidth: {
        minWidth: 150
    }
  });


function Register() {
    let history = useHistory();
    const classes = useStyles();
    const [Name, setName] = useState('');
    const [Password, setPassword] = useState ('');
    const [PasswordConfirm, setPasswordConfirm] = useState ('');
    const [Pronouns, setPronouns] = useState ('');
    const [Team, setTeam] = useState({id:''});
    const teams = useSelector(state => state.teams);
    const [passwordError, setPasswordError] = useState(false)
    const [passwordMatchError, setPasswordMatchError] = useState(false)
    const [nameError, setNameError] = useState(false);
    const [teamError, setTeamError] = useState(false);
    const dispatch = useDispatch();

    const handleChangeName = (event) => {
        setName(event.target.value)
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleChangePasswordConfirm = (event) => {
        setPasswordConfirm(event.target.value)
    }

    const handleChangePronouns = (event) => {
        setPronouns(event.target.value);
    };

    const handleChangeTeam = ( event ) => {
        let id = event.target.value
        for ( let team of teams ){
            if ( team.id === id ){
                setTeam( team );
            }
        } 
    }

    const handleRegister = () => {
        if (!Name){
            setNameError(true)
             // TO DO: replace alert with better UI
            alert('The Name field cannot be left blank')
            return
        }
        if (Password.length<7){
            setPasswordError(true)
             // TO DO: replace alert with better UI
            alert(`oops! Password must contain at least 7 characters`)
            setNameError(false);
            return
        }
        if (Password !== PasswordConfirm){
            setPasswordMatchError(true)
            // TO DO: replace alert with better UI
            alert(`oops! Passwords don't match`)
            setPasswordError(false);
            setNameError(false);
            return
        } 
        if(!Team.id){
            setTeamError(true);
            // TO DO: replace alert with better UI
            alert(`You have to pick from the selected teams or "other"`);
            setPasswordError(false);
            setNameError(false);
            setPasswordMatchError(false);
            return
        }
        const loginObject = {
            name: Name,
            password: Password,
            team_id: Team.id,
            pronouns: Pronouns,
            team_name: Team.name
        }
         //dispatch login saga HERE
         dispatch({ type: "REGISTER", payload: loginObject })
        //nest this after returned promise, tho
        history.push("/form");
    }

    const handleReturningUser = () => {
        // go to register page here!
        dispatch({type:'SET_TO_LOGIN_MODE'})
    }

    return (
      <div>
          <div className = "spacer"> </div>
            <h3><em>New StarBoard User?</em></h3>
            <h1>Register Here!</h1>
            <Grid container justify="space-around" direction = "column" spacing = {2}>
            <Grid item>
                <TextField required label = "Name" value = {Name} onChange = {handleChangeName} error ={nameError}/>
                {"\u00a0"}{"\u00a0"}
                <TextField id="pronouns" label="Pronouns" value={Pronouns} onChange = {handleChangePronouns} />
            </Grid>
            <Grid item>
                <TextField required 
                    type = "password"
                    label = "Password" 
                    value = {Password} 
                    error = {passwordError}
                    onChange = {handleChangePassword}/> 
                {"\u00a0"}{"\u00a0"}
                <TextField required 
                    type = "password" 
                    label = "Confirm Password" 
                    value = {PasswordConfirm} 
                    error ={passwordMatchError} 
                    onChange = {handleChangePasswordConfirm}/> 
            </Grid>
            <Grid item>
            <FormControl  className = {classes.formWidth} required error = {teamError}>
                    <InputLabel id="team-picker-label">Team</InputLabel>
                        <Select
                        labelId="team-picker-label"
                        id="team-picker"
                        value={Team.id}
                        onChange={handleChangeTeam}
                        >
                        {teams.map((team, index)=>( 
                            <MenuItem value={team.id} key = {index}>{team.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <br/>
            <Grid container item direction = "row" justify = "center" alignItems = "center" spacing = {4}>
                <Grid item>
                    <Button variant = 'contained' className={classes.root} onClick={handleRegister}> 
                        Register Account
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant = 'contained' className={classes.root} onClick = {handleReturningUser}> 
                        Returning User?
                    </Button>
                </Grid>
            </Grid>
        </Grid>
      </div>
    );
  }
  
  export default Register;