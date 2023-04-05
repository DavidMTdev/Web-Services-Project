import _ from 'lodash'
import { useState, createContext, Suspense, useEffect } from 'react'
import {
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom"
import { useQuery, useQueries, useQueryClient, useMutation } from "@tanstack/react-query"

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
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

import AppBar from '../components/AppBar'
import AppDrawer from '../components/AppDrawer'
import AppMain from '../components/AppMain'
import NestedListItem from "../components/NestedListItem"
import NestedListSubItem from '../components/NestListSubItem'


import { getDatabases, getTables, postDatabase, postTable, deleteTable } from '../api/root'

const AppContext = createContext(null)

const databasesQuery = () => ({
  queryKey: ["databases"],
  queryFn: () => getDatabases(),
  onSuccess: (data) => {
    // console.log('onSuccess')
    // console.log(data)
  },
  initialData: () => {
    // console.log('initialData')
    return [{ name: 'initialData', open: false, tables: []}]
  },
  placeholderData: () => {
    // console.log('placeholderData')
    return [[{ name: 'placeholderData', open: false, tables: []}]]
  },
  structuralSharing: (oldData, newData) => {
    // console.log('structuralSharing')
    const data = newData.databases.map(item => ({ name: item, open: false, tables: []}))
    return [...data]
  }
})

const tablesQuery = (database) => ({
  queryKey: [database, "tables"],
  queryFn: () => getTables(database),
})

export const loader = (queryClient) => async ({ request }) => {
  console.log('loader root')
  if (!queryClient.getQueryData(databasesQuery().queryKey)) {
    const data = await queryClient.fetchQuery(databasesQuery())
    data.databases.map((database) => {
      queryClient.prefetchQuery(tablesQuery(database))
    })

    // databases.databases.map(item => ({ name: item, open: false, tables: []}))
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
  const { data: databases } = useQuery(databasesQuery())
  // const tableQueries = useQueries({
  //   queries: databases.databases.map((database) => {
  //     return {
  //       queryKey: tablesQuery(database).queryKey,
  //       queryFn: tablesQuery(database).queryFn,
  //       enabled: false,
  //     }
  //   })
  // })
  // const databases = queryClient.getQueryData(databasesQuery().queryKey)
  const mutationDB = useMutation({
    mutationFn: (data) => postDatabase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: databasesQuery().queryKey })
    }
  })
  const mutationTable = useMutation({
    mutationFn: (data) => postTable(data),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: databasesQuery().queryKey })
      queryClient.invalidateQueries({ queryKey: tablesQuery(variables.database).queryKey })
    }
  })
  const mutationDeleteTable = useMutation({
    mutationFn: (data) => deleteTable(data),
    onSuccess: (variables) => {
      queryClient.invalidateQueries({ queryKey: databasesQuery().queryKey })
      queryClient.invalidateQueries({ queryKey: tablesQuery(variables.database).queryKey })
    }
  })

  const [open, setOpen] = useState(true)
  const [data, setData] = useState([])
  const [openModal, setOpenModal] = useState(false)


  useEffect(() => {
    // console.log('Root useEffect', data)
  }, [data])  

  useEffect(() => {
    if (databases) {
      // setData(databases.databases.map(item => ({ name: item, open: false, tables: []})))
    }
  }, [databases])

  const handleClick = (index) => {
    const tables = queryClient.getQueryData(tablesQuery(databases[index].name).queryKey)
    const newData = [...databases]
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
    // console.log(e.target[0].value)
    // console.log(e.target[2].value)
    const db = e.target[0].value
    const tb = e.target[2].value

    if (db) {
      console.log('db', db)
      mutationDB.mutate({ database: db})
    }

    if (tb) {
      console.log('tb', tb)
      mutationTable.mutate({ database: db, table: tb })
    }

    handleCloseModal()
  }

  const handleDeleteTable = (db, tb) => {
    console.log('delete', db, tb)
    mutationDeleteTable.mutate({ database: db, table: tb })
  }

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <AppContext.Provider value={{ data, setData }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar theme={theme} open={open} click={handleDrawerClick} />
        <AppDrawer theme={theme} open={open} click={handleDrawerClose} >
          <Box 

            direction="row"
            spacing={0}
            margin={2}
          >
            <Button 
              variant="contained" 
              sx={{ width: '100%' }}
              onClick={handleOpenModal}
            >
              + Create Database
            </Button>
          </Box >
  
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={subheader}
          >
            <Suspense fallback={<Loading />}>

              {databases.map((item, index) => (
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
                          click2={() => handleDeleteTable(item.name, table.name)}
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

      <Modal
        open={openModal}
        // onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box 
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={(e) => handleSubmit(e)}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            '& > :not(style)': { my: 2 },
          }}
        > 
          <Typography id="modal-modal-title" variant="h5" component="h3" mb={2}>
            Create Database
          </Typography>
          <FormControl fullWidth>
            <InputLabel htmlFor="component-simple">Database Name</InputLabel>
            <OutlinedInput id="component-simple" placeholder="Enter database name" label="Database Name" name='database'/>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel htmlFor="component-outlined">Table Name</InputLabel>
            <OutlinedInput id="component-outlined" placeholder="Enter table name" label="Table Name" name='table'/>
          </FormControl>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Button variant="contained" onClick={handleCloseModal} color="error">
              Cancel
            </Button>
            <Button variant="contained" type='submit'>
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>
    </AppContext.Provider>
  )
}

export default Root