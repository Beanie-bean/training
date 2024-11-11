import { useState } from 'react';

import { updateCustomer } from '../trainingapi';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export default function EditCustomer(props) {
    const [customer, setCustomer] = useState({
        firstname: "",
        lastname: "",
        streetaddress: "",
        postcode: "",
        city: "",
        email: "",
        phone: ""
    });

    const [open, setOpen] = useState(false);

    const handleSave = () => {
        updateCustomer(props.data._links.customer.href, customer)
            .then(() => props.handleFetch())
            .catch(err => console.error(err))
    }

    const handleClickOpen = () => {
        setOpen(true);
        setCustomer({
            firstname: props.data.firstname,
            lastname: props.data.lastname,
            streetaddress: props.data.streetaddress,
            postcode: props.data.postcode,
            city: props.data.city,
            email: props.data.email,
            phone: props.data.phone
        })
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <IconButton size="small" onClick={handleClickOpen} color="default" aria-label="default-button">
                <EditIcon />
            </IconButton>

            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Edit Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={event => setCustomer({ ...customer, firstname: event.target.value })}
                        value={customer.firstname}
                        name="firstname"
                        label="First name"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setCustomer({ ...customer, lastname: event.target.value })}
                        value={customer.lastname}
                        name="lastname"
                        label="Last name"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setCustomer({ ...customer, streetaddress: event.target.value })}
                        value={customer.streetaddress}
                        name="streetaddress"
                        label="Street address"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setCustomer({ ...customer, postcode: event.target.value })}
                        value={customer.postcode}
                        name="postcode"
                        label="Postcode"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setCustomer({ ...customer, city: event.target.value })}
                        value={customer.city}
                        name="city"
                        label="City"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setCustomer({ ...customer, email: event.target.value })}
                        value={customer.email}
                        name="email"
                        label="Email"
                        variant="standard"
                        margin="dense"
                        fullWidth
                    />
                    <TextField
                        onChange={event => setCustomer({ ...customer, phone: event.target.value })}
                        value={customer.phone}
                        name="phone"
                        label="Phone"
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
