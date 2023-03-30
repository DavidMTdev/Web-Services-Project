import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

const NestedListItem = ({ text, isOpen, click, open = false }) => {

  if (open) {
    return (
      <ListItemButton onClick={click}>
        <ListItemIcon>
          <StarBorder />
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    )
  }

  return ( 
    <ListItemButton  onClick={click}>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary={text} />
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  )
}
 
export default NestedListItem