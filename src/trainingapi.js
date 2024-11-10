export function getCustomers() {
    return fetch(import.meta.env.VITE_API_URL + "customers")
        .then(response => {
            if (!response.ok)
                throw new Error("Error in fetching customers: " + response.statusText);

            return response.json();
        })
}

export function deleteCustomer(url) {
    return fetch(url, { method: "DELETE" })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in deleting customer: " + response.statusText)

            return response.json();
        })
}

export function saveCustomer(newCustomer) {
    return fetch(import.meta.env.VITE_API_URL + "customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in saving customer:" + response.statusText);

            return response.json();
        })
}

export function updateCustomer(url, customer) {
    return fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in saving customer:" + response.statusText);

            return response.json();
        })
}

export function getTrainings() {
    return fetch(import.meta.env.VITE_API_URL + "gettrainings")
        .then(response => {
            if (!response.ok)
                throw new Error("Error in fetching trainings: " + response.statusText);

            return response.json();
        })
}

export function deleteTraining(params) {
    return fetch(import.meta.env.VITE_API_URL + "trainings" + "/" + params, { method: "DELETE" })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in deleting training: " + response.statusText)

            return response.json();
        })
}

export function saveTraining(newTraining) {
    return fetch(import.meta.env.VITE_API_URL + "trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTraining)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in saving training:" + response.statusText);

            return response.json();
        })
}