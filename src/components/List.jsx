import { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';

import { getCustomers, deleteCustomer, getTrainings, deleteTraining } from '../trainingapi';
import EditCustomer from './EditCustomer';
import AddCustomer from './addCustomer';
import AddTraining from './addTraining';

import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

function List() {
    const [customers, setCustomers] = useState([])
    const [trainings, setTrainings] = useState([])

    const [tabIndex, setTabIndex] = useState(0);

    const [open, setOpen] = useState(false);

    const localizer = dayjsLocalizer(dayjs)

    const [customerColDefs, setCustomerColDefs] = useState([
        { headerName: "First Name", field: "firstname", filter: true, floatingFilter: true },
        { headerName: "Last Name", field: "lastname", filter: true, floatingFilter: true },
        { headerName: "Email", field: "email", filter: true, floatingFilter: true },
        { headerName: "Phone", field: "phone", filter: true, floatingFilter: true },
        { headerName: "Address", field: "streetaddress", filter: true, floatingFilter: true, width: 250 },
        { headerName: "Postcode", field: "postcode", filter: true, floatingFilter: true },
        { headerName: "City", field: "city", filter: true, floatingFilter: true },
        {
            width: 70,
            cellRenderer: params => <IconButton onClick={() => handleDeleteCustomer(params.data)} color="error" size="small" aria-label="error-button">
                <DeleteIcon />
            </IconButton>
        },
        {
            width: 70,
            cellRenderer: params => <EditCustomer data={params.data} handleFetch={handleFetch} />,
        },
        {
            width: 200,
            cellRenderer: params => <AddTraining data={params.data} handleFetch={handleFetch} />,

        },
    ])

    const [trainingColDefs, setTrainingColDefs] = useState([
        { headerName: "Activity", field: "activity", filter: true, floatingFilter: true },
        {
            headerName: "Date", field: 'date', filter: true, floatingFilter: true,
            valueFormatter: function (params) {
                return dayjs(params.value).format('DD/MM/YYYY HH:mm')
            }
        },
        { headerName: "Duration (min)", field: "duration", filter: true, floatingFilter: true },
        {
            headerName: "Customer",
            valueGetter: (p) => p.data.customer.firstname + " " + p.data.customer.lastname, filter: true, floatingFilter: true
        },
        {
            width: 70,
            cellRenderer: params => <IconButton onClick={() => handleDeleteTraining(params.data.id)} color="error" size="small" aria-label="error-button">
                <DeleteIcon />
            </IconButton>
        },
    ])

    const gridOptions = {
        autoSizeStrategy: {
            type: "fitGridWidth",
        },
    };

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        getCustomers()
            .then(data => setCustomers(data._embedded.customers))
            .catch(error => console.error(error))
        getTrainings()
            .then((data => setTrainings(data)))
            .catch(error => console.error(error))
    }

    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex)
    }

    const handleDeleteCustomer = (params) => {
        if (window.confirm("Are you sure?")) {
            setOpen(true);
            deleteCustomer(params._links.self.href)
                .then(() => handleFetch())
                .catch(error => console.error(error))
        }
    }

    const handleDeleteTraining = (params) => {
        if (window.confirm("Are you sure?")) {
            setOpen(true);
            deleteTraining(params)
                .then(() => handleFetch())
                .catch(error => console.error(error))
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleClickExport = () => {
        let csv = "First Name,Last Name,Email,Phone,Address,Postcode,City\n";
        customers.forEach(customer => {
            csv += `${customer.firstname},${customer.lastname},${customer.email},${customer.phone},${customer.streetaddress},${customer.postcode},${customer.city}\n`
        });
        const blob = new Blob([csv], { type: "text/csv" })

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a");
        a.href = url;
        a.download = "customers.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const events = trainings.map(trainingsData => ({
        title: trainingsData.activity,
        start: dayjs(trainingsData.date).toDate(),
        end: dayjs(trainingsData.date).add(trainingsData.duration, 'minute').toDate()
    }));

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mt: 1,
            }}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label='Customers' index={0} />
                    <Tab label='Trainings' index={1} />
                    <Tab label='Calendar' index={2} />
                </Tabs>
                {tabIndex === 0 && (
                    <>
                        <AddCustomer handleFetch={handleFetch} />
                        <IconButton onClick={handleClickExport} size="large">
                            <FileUploadIcon />
                        </IconButton>
                    </>
                )}
            </Box>

            <div className='ag-theme-material' style={{ height: 600 }}>
                {tabIndex === 0 && (
                    <AgGridReact
                        rowData={customers}
                        columnDefs={customerColDefs}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationAutoPageSize={true}
                        suppressCellFocus={true}
                    />
                )}
                {tabIndex === 1 && (
                    <AgGridReact
                        rowData={trainings}
                        columnDefs={trainingColDefs}
                        gridOptions={gridOptions}
                        pagination={true}
                        paginationAutoPageSize={true}
                        suppressCellFocus={true}
                    />
                )}
                {tabIndex === 2 && (
                    <Calendar
                        localizer={localizer}
                        events={events}
                        defaultView={"month"}
                        style={{ height: 500 }}
                    />
                )}
                <Snackbar
                    open={open}
                    message="Delete Successful"
                    autoHideDuration={3000}
                    onClose={handleClose}
                />
            </div>
        </>
    )
}

export default List;