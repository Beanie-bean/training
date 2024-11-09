import { getCustomers } from '../trainingapi';
import { getTrainings } from '../trainingapi';

import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import dayjs from 'dayjs';


import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";


function List() {
    const [customers, setCustomers] = useState([])
    const [trainings, setTrainings] = useState([])

    const [tabIndex, setTabIndex] = useState(0);

    const [customerColDefs, setCustomerColDefs] = useState([
        { headerName: "First Name", field: "firstname", filter: true, floatingFilter: true },
        { headerName: "Last Name", field: "lastname", filter: true, floatingFilter: true },
        { headerName: "Email", field: "email", filter: true, floatingFilter: true },
        { headerName: "Phone", field: "phone", filter: true, floatingFilter: true },
        { headerName: "Address", field: "streetaddress", filter: true, floatingFilter: true },
        { headerName: "Postcode", field: "postcode", filter: true, floatingFilter: true },
        { headerName: "City", field: "city", filter: true, floatingFilter: true },
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
        { headerName: "Customer", valueGetter: (p) => p.data.customer.firstname + " " + p.data.customer.lastname, filter: true, floatingFilter: true }
    ])

    const gridOptions = {
        autoSizeStrategy: {
            type: "fitGridWidth",
        },
    };

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

    return (
        <>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label='Customers' index={0} />
                <Tab label='Trainings' index={1} />
            </Tabs>

            <div className='ag-theme-material' style={{ height: 700 }}>
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