import { useState, createContext, Suspense, useEffect } from 'react'

import { useQueries, useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

import axios from "axios"

import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import StarBorder from '@mui/icons-material/StarBorder'
import ListSubheader from '@mui/material/ListSubheader'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import DirectionsIcon from '@mui/icons-material/Directions'
import Skeleton from '@mui/material/Skeleton'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import Stack from '@mui/material/Stack'
import StorageIcon from '@mui/icons-material/Storage'
import TableRowsIcon from '@mui/icons-material/TableRows'
import Menu from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'

import AppBar from './components/AppBar'
import AppDrawer from './components/AppDrawer'
import AppMain from './components/AppMain'
import NestedListItem from "./components/NestedListItem"
import NestedListSubItem from './components/NestListSubItem'

import { getDatabases, getTables, postDatabase } from './api/root'

const AppContext = createContext(null)

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

export default function App() {
  const theme = useTheme()
  const queryClient = useQueryClient()
  const [contextMenu, setContextMenu] = useState(null)
  const [open, setOpen] = useState(true)
  const [data , setData] = useState([])
  const databasesQuery = useQuery({
    queryKey: ["GET /"],
    queryFn: getDatabases,
    onSuccess: (res) => {
      const newData = res.databases.map((item) => {
        return {
          name: item,
          open: false,
          tables: []
        }
      })
      setData([...newData])
    },  
    initialData: () => {
      return data
    }
  })

  const tableQueries = useQueries({
    queries: data.map((database) => {
      return {
        queryKey: ["GET /", database.name],
        queryFn: () => getTables(database.name),
        onSuccess: (res) => {
          const dataIndex = data.findIndex((item) => item.name === database.name)
          const newData = [...data]
          res.tables.map((item) => {
            newData[dataIndex].tables.push({
              name: item,
              columns: {},
              data: []
            })
          })
          setData([...newData])
        },
        initialData: () => {
          return data[data.findIndex((item) => item.name === database.name)]
        },
        enabled: databasesQuery.status === "success" && database.tables.length === 0,
      }
    })
  })

  const mutation = useMutation({
    mutationFn: (name) => postDatabase(name),
    onSuccess: (res) => {
      queryClient.fetchQuery(["GET /"])
    },
  })

  // useEffect(() => {
  //   console.log(`data`)
  //   console.log(data)
  // }, [data])

  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    )
  }

  const handleContextMenuClose = () => {
    setContextMenu(null);
  }

  const handleClick = (index) => {
    const newData = [...data]
    newData[index].open = !newData[index].open
    setData(newData)
  }

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(e.target[0].value)
  }

  return (
    <AppContext.Provider value={{ open, data }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar theme={theme} open={open} click={handleDrawerOpen} />
        <AppDrawer theme={theme} open={open} click={handleDrawerClose} >
          <Stack 
            component="form"
            direction="row"
            spacing={0}
            margin={2}
            noValidate
            autoComplete="off"
            onSubmit={(e) => handleSubmit(e)}
          >
            <TextField id="outlined-basic" label="Database Name" variant="outlined" />
            <Button type='submit' variant="contained" endIcon={<SendIcon />} />
          </Stack >
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={subheader}
          >
            <Suspense fallback={<Loading />}>
              {data.map((item, index) => (
                <Box key={index} onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }} >
                  {/* { 
                    item.tables.length > 0 
                    ? <NestedListItem text={item.name} isOpen={item.open} click={() => handleClick(index)} icon={<StorageIcon />} open /> 
                    : <NestedListItem text={item.name} isOpen={item.open} click={() => handleClick(index)} icon={<StorageIcon />} /> 
                  } */}
                  <NestedListItem text={item.name} isOpen={item.open} click={() => handleClick(index)} icon={<StorageIcon />} open /> 

                  <NestedListSubItem isOpen={item.open} >
                    {item.tables.map((table, i) => (
                      <NestedListItem key={i} sx={{ pl: 4 }} text={table.name} icon={<TableRowsIcon />} /> 
                    ))}
                  </NestedListSubItem>

                  {/* <Menu
                    open={contextMenu !== null}
                    onClose={handleContextMenuClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                      contextMenu !== null
                        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                        : undefined
                    }
                  >
                    <MenuItem onClick={() => console.log("delet")}>Delete</MenuItem>
                  </Menu> */}
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
