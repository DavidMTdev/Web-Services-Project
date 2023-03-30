import List from '@mui/material/List'
import Collapse from '@mui/material/Collapse'

const NestedListSubItem = ({ children, isOpen}) => {
  return ( 
    <Collapse in={isOpen} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {children}
      </List>
    </Collapse>
  )
}
 
export default NestedListSubItem