import axios from "axios"

const url = "http://localhost:3000"

export const optionDatabases = () => {
    return axios.options(`${url}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const getDatabases = () => {
    return axios.get(`${url}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const postDatabase = (database) => {
    return axios.post(`${url}`, { database: database })
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const getTables = (database) => {
    return axios.get(`${url}/${database}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const prefetchTables = async (queryClient, database) => {
    await queryClient.prefetchQuery([`tables`, database], () => {
        return axios.get(`${url}/${database}`)
        .then(res => res.data)
        .catch(err => console.log(err))
    })
}