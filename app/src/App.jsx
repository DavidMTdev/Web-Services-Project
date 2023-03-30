import { useState, createContext } from 'react'

import { useQuery } from "@tanstack/react-query"

import axios from "axios"

import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import StarBorder from '@mui/icons-material/StarBorder'
import ListSubheader from '@mui/material/ListSubheader'

import AppBar from './components/AppBar'
import AppDrawer from './components/AppDrawer'
import AppMain from './components/AppMain'
import NestedListItem from "./components/NestedListItem"
import NestedListSubItem from './components/NestListSubItem'

const AppContext = createContext(null)

const subheader = (
  <ListSubheader component="div" id="nested-list-subheader">
    Databases
  </ListSubheader>
)

export default function App() {
  const theme = useTheme()
  const [open, setOpen] = useState(true)
  const [data2 , setData] = useState([{
    name: 'Database 1',
    open: true,
    tables: [
      {
        name: 'Table 1'
      }, {
        name: 'Table 2'
      }
    ]
  }, {
    name: 'Database 2',
    open: false,
    tables: []
  }
  ])
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["database"],
    queryFn: () =>
      axios
        .get("http://localhost:3000")
        .then((res) => res.data)
        .catch((err) => console.log(err))
  })

  const handleClick = (index) => {
    const newData = [...data2]
    newData[index].open = !newData[index].open
    setData(newData)
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppContext.Provider value={{ open, data }}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar theme={theme} open={open} click={handleDrawerOpen} />
        <AppDrawer theme={theme} open={open} click={handleDrawerClose} >
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={subheader}
          >
            {data2.map((item, index) => (
              <Box key={index} >
                { 
                  item.tables.length > 0 
                  ? <NestedListItem text={item.name} isOpen={item.open} click={() => handleClick(index)} icon={<InboxIcon />} open /> 
                  : <NestedListItem text={item.name} isOpen={item.open} click={() => handleClick(index)} icon={<InboxIcon />} /> 
                }

                <NestedListSubItem isOpen={item.open} >
                  {item.tables.map((table, i) => (
                    <NestedListItem sx={{ pl: 4 }} text={table.name} icon={<StarBorder />} /> 
                  ))}
                </NestedListSubItem>

              </Box>
            ))}
          </List>
        </AppDrawer>
        <AppMain theme={theme} open={open} />
      </Box>
    </AppContext.Provider>
  )
}
