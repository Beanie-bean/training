import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

import { getCustomers, deleteCustomer, getTrainings, deleteTraining } from '../trainingapi';
import EditCustomer from './EditCustomer';
import AddCustomer from './addCustomer';
import AddTraining from './addTraining';

function List() {
    const [customers, setCustomers] = useState([])
    const [trainings, setTrainings] = useState([])

    const [tabIndex, setTabIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const [customerColDefs, setCustomerColDefs] = useState([
        { headerName: "First Name", field: "firstname", filter: true, floatingFilter: true },
        { headerName: "Last Name", field: "lastname", filter: true, floatingFilter: true },
        { headerName: "Email", field: "email", filter: true, floatingFilter: true },
        { headerName: "Phone", field: "phone", filter: true, floatingFilter: true },
        { headerName: "Address", field: "streetaddress", filter: true, floatingFilter: true, width: 250},
        { headerName: "Postcode", field: "postcode", filter: true, floatingFilter: true },
        { headerName: "City", field: "city", filter: true, floatingFilter: true},
        {
            width: 70, cellRenderer: params => <IconButton onClick={() => handleDeleteCustomer(params.data)} color="error" size="small" aria-label="error-button">
                <DeleteIcon />
            </IconButton>
        },
        {
            width: 70, cellRenderer: params => <EditCustomer data={params.data} handleFetch={handleFetch} />,
        },
        {
            width: 200, cellRenderer: params => <AddTraining data={params.data} handleFetch={handleFetch} />,

        },
    ])
    const [trainingColDefs, setTrainingColDefs] = useState([
        { headerName: "Activity", field: "activity", filter: true, floatingFilter: true },
        {
            headerName: "Date", field: 'date', filter: true, floatingFilter: true,
            valueFormatter: function (params) {
                return dayjs(params.value).format('DD/MM/YYYY')
            }
        },
        { headerName: "Duration", field: "duration", filter: true, floatingFilter: true },
        { headerName: "Customer", valueGetter: (p) => p.data.customer.firstname + " " + p.data.customer.lastname, filter: true, floatingFilter: true },
        {
            width: 70, cellRenderer: params => <IconButton onClick={() => handleDeleteTraining(params.data.id)} color="error" size="small" aria-label="error-button">
                <DeleteIcon />
            </IconButton>
        },
    ])
    const gridOptions = {
        autoSizeStrategy: {
            type: "fitGridWidth",
        },
    };
    console.log(trainings)
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex)
    }

    useEffect(() => {
        handleFetch();
    }, []);

    const handleFetch = () => {
        getCustomers()
            .then(data => setCustomers(data._embedded.customers))
            .catch(error => console.error(error))
        getTrainings()
            .then(data => setTrainings(data))
            .catch(error => console.error(error))
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
    return (
        <>
            <div>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    mt: 1,
                }}>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label='Customers' index={0} />
                        <Tab label='Trainings' index={1} />
                    </Tabs>
                    <AddCustomer handleFetch={handleFetch} />
                </Box>
            </div>

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
            </div>
        </>
    )
}

export default List;