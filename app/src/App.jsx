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

const AppContext = createContext(null)

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
    console.log(index)
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
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Databases
              </ListSubheader>
            }
          >
            {data.map((item, index) => (
              <>
                <ListItemButton  onClick={() => handleClick(index)}>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {item.open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={item.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.tables.map((table, i) => (
                      <ListItemButton key={i} sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary={table.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ))}
          </List>
        </AppDrawer>
        <AppMain theme={theme} open={open} />
      </Box>
    </AppContext.Provider>
  );
}
