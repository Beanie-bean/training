import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { saveTraining } from '../trainingapi';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1
});


export default function AddTraining(props) {
    const [training, setTraining] = useState({
        date: dayjs(),
        duration: "",
        activity: "",
        customer: ""
    });
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
        setTraining({...training, customer: props.data._links.customer.href})
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        saveTraining(training)
            .then(() => {
                props.handleFetch();
                handleClose();
            })
            .catch(err => console.error(err))
    }

    const changeDate = (newDate) => {
        setTraining({ ...training, date: newDate })
    };
    return (
        <>
            <Button size="small" onClick={handleClickOpen} color="primary" aria-label="add">
                Add Training
            </Button>
        
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>New Training</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{ marginTop: 1 }}
                            margin="dense"
                            name="date"
                            label="Date"
                            format="DD/MM/YYYY"
                            value={dayjs(training.date)}
                            onChange={(date) => changeDate(date)}
                        />
                    </LocalizationProvider>
                    <TextField
                        margin="dense"
                        name="duration"
                        value={training.duration}
                        onChange={event => setTraining({ ...training, duration: event.target.value })}
                        label="Duration"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="activity"
                        value={training.activity}
                        onChange={event => setTraining({ ...training, activity: event.target.value })}
                        label="Activity"
                        fullWidth
                        variant="standard"
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
