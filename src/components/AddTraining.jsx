import { useState } from 'react';

import { saveTraining } from '../trainingapi';

import dayjs from 'dayjs';
import updateLocale from "dayjs/plugin/updateLocale";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';



export default function AddTraining(props) {
    const [training, setTraining] = useState({
        date: dayjs(),
        duration: "",
        activity: "",
        customer: ""
    });
    
    const [open, setOpen] = useState(false);
    
    dayjs.extend(updateLocale);
    
    dayjs.updateLocale("en", {
      weekStart: 1
    });

    const handleSave = () => {
        saveTraining(training)
            .then(() => {
                props.handleFetch();
                handleClose();
            })
            .catch(err => console.error(err))
    }

    const handleClickOpen = () => {
        setOpen(true);
        setTraining({...training, customer: props.data._links.customer.href})
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const changeDate = (newDate) => {
        setTraining({ ...training, date: newDate })
    };

    return (
        <>
            <Button onClick={handleClickOpen} size="small" color="primary" aria-label="add">
                Add Training
            </Button>
        
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            onChange={(date) => changeDate(date)}
                            value={dayjs(training.date)}
                            format='DD/MM/YYYY HH:mm'
                            ampm={false}
                            name="date"
                            label="Date"
                            margin="dense"
                            sx={{ marginTop: 1 }}
                        />
                    </LocalizationProvider>
                    <TextField
                        onChange={event => setTraining({ ...training, duration: event.target.value })}
                        value={training.duration}
                        name="duration"
                        label="Duration"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setTraining({ ...training, activity: event.target.value })}
                        value={training.activity}
                        name="activity"
                        label="Activity"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
