import axios from "axios"

const url = "http://localhost:3000"

export const optionDatabases = () => {
    return axios.options(`${url}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const getDatabases = async () => {
    return await axios.get(`${url}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const postDatabase = (data) => {
    return axios.post(`${url}`, { database: data.database })
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const deleteDatabase = (database) => {
    return axios.delete(`${url}/${database}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const getTables = async (database) => {
    return await axios.get(`${url}/${database}`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const postTable = (data) => {
    return axios.post(`${url}/${data.database}`, { table: data.table })
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const getData = async (database, table) => {
    // await new Promise((r) => setTimeout(r, 1000))
    return await axios.get(`${url}/${database}/${table}/data`)
    .then(res => res.data)
    .catch(err => console.log(err))
}

export const getColumns = async (database, table) => {
    return await axios.get(`${url}/${database}/${table}/columns`)
    .then(res => res.data)
    .catch(err => err)
}