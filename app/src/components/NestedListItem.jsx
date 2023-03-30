import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const NestedListItem = ({ sx, text, click, isOpen, open, icon }) => {

  if (!open) {
    return (
      <ListItemButton sx={sx} onClick={click}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    )
  }

  return ( 
    <ListItemButton sx={sx} onClick={click}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={text} />
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  )
}
 
export default NestedListItem