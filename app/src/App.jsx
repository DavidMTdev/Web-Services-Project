import { useState, createContext } from 'react'
import { useTheme } from '@mui/material/styles'

import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'
import Collapse from '@mui/material/Collapse'
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
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [data , setData] = useState([{
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

  const handleClick = (index) => {
    const newData = [...data]
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
            {data.map((item, index) => (
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
