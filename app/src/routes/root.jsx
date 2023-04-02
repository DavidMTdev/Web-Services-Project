import _ from 'lodash'
import { useState, createContext, Suspense, useEffect } from 'react'
import {
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom"
import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query"

import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import ListSubheader from '@mui/material/ListSubheader'
import TextField from '@mui/material/TextField'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import Stack from '@mui/material/Stack'
import StorageIcon from '@mui/icons-material/Storage'
import TableRowsIcon from '@mui/icons-material/TableRows'

import AppBar from '../components/AppBar'
import AppDrawer from '../components/AppDrawer'
import AppMain from '../components/AppMain'
import NestedListItem from "../components/NestedListItem"
import NestedListSubItem from '../components/NestListSubItem'


import { getDatabases, getTables, postDatabase } from '../api/root'

const AppContext = createContext(null)

const databasesQuery = () => ({
  queryKey: ["databases", "list", "all"],
  queryFn: () => getDatabases(),
})

const tablesQuery = (database) => ({
  queryKey: [database, "tables", "list", "all"],
  queryFn: () => getTables(database),
})

export const loader = (queryClient) => async ({ request }) => {
  if (!queryClient.getQueryData(databasesQuery().queryKey)) {
    const data = await queryClient.fetchQuery(databasesQuery())
    data.databases.map((database) => {
      queryClient.prefetchQuery(tablesQuery(database))
    })
  }
  return { request }
}

// export const action = (queryClient) => async () => {
//   const contact = {}
//   console.log('action');
//   // const contact = await createContact();
//   queryClient.invalidateQueries({ queryKey: ["contacts", "list"] });
//   return contact;
// };

const subheader = (
  <ListSubheader component="div" id="nested-list-subheader">
    Databases
  </ListSubheader>
)

const Loading = () => {
  return (
    <Skeleton variant="rounded" width={220} height={60} />
  )
}


const Root = () => {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const databases = queryClient.getQueryData(databasesQuery().queryKey)

  const [open, setOpen] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    // console.log('Root useEffect', data)
  }, [data])  

  useEffect(() => {
    if (databases) {
      setData(databases.databases.map(item => ({ name: item, open: false, tables: []})))
    }
  }, [databases])

  const handleClick = (index) => {
    const tables = queryClient.getQueryData(tablesQuery(data[index].name).queryKey)
    const newData = [...data]
    newData[index].open = !newData[index].open
    let newTables = []

    tables.tables.map((table) => {
      newTables = [...newTables, { name: table, columns: {}, data: [] }]
    })

    newData[index].tables = [...newTables]
    setData([...newData])
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleDrawerClick = () => {
    setOpen(!open)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // mutation.mutate(e.target[0].value)
  }


  return (
    <AppContext.Provider value={{ data, setData }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar theme={theme} open={open} click={handleDrawerClick} />
        <AppDrawer theme={theme} open={open} click={handleDrawerClose} >
          <Box 
            component="form"
            direction="row"
            spacing={0}
            margin={2}
            noValidate
            autoComplete="off"
            onSubmit={(e) => handleSubmit(e)}
            
          >
            {/* <TextField id="outlined-basic" label="Database Name" variant="outlined" /> */}
            {/* <Button type='submit' variant="contained" endIcon={<SendIcon />} /> */}
            <Button type='submit' variant="contained" sx={{ width: '100%' }}>
              + Create Database
            </Button>
          </Box >
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={subheader}
          >
            <Suspense fallback={<Loading />}>

              {data.map((item, index) => (
                  <Box key={index} style={{ cursor: 'context-menu' }} >

                    <NestedListItem 
                      text={item.name} 
                      isOpen={item.open} 
                      click={() => handleClick(index)} 
                      icon={<StorageIcon />} 
                      open 
                    /> 

                    <NestedListSubItem isOpen={item.open} >
                      {item.tables.map((table, i) => (
                        <NestedListItem 
                          key={i} 
                          sx={{ pl: 4 }} 
                          text={table.name} 
                          icon={<TableRowsIcon fontSize="samll" />}
                          click={() => navigate(`/${item.name}/${table.name}`)}
                        /> 
                      ))}
                    </NestedListSubItem>
                  </Box>
                ))}
             
            </Suspense>
          </List>
        </AppDrawer>
        <AppMain theme={theme} open={open} />
      </Box>
    </AppContext.Provider>
  )
}

export default Root