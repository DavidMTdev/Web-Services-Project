import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import AppBarStyled from './styles/AppBar'

const AppBar = ({ theme, open, click }) => {
  const iconBackColor = 'grey.100'
  const iconBackColorOpen = 'grey.200'

  return ( 
    <AppBarStyled position="fixed" open={open}>
      <Toolbar>
        {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={click}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton> */}
        <IconButton
          disableRipple
          aria-label="open drawer"
          onClick={click}
          edge="start"
          color="inherit"
          sx={{ mr: 2 }}
        >
          {open ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          InMemory My Admin
        </Typography>
      </Toolbar>
    </AppBarStyled> 
  )
}
 
export default AppBar