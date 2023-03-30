import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'

import AppBarStyled from './styles/AppBar'

const AppBar = ({ theme, open, click }) => {
    return ( 
        <AppBarStyled position="fixed" open={open}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={click}
                edge="start"
                sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                Persistent drawer
            </Typography>
            </Toolbar>
        </AppBarStyled> 
    )
}
 
export default AppBar