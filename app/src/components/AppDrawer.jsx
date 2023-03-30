import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import DrawerHeaderStyled from './styles/DrawerHeader'

import { DRAWER_WIDTH } from '../constants'

const AppDrawer = ({ theme, open, click, children }) => {
    return ( 
        <Drawer
            sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                boxSizing: 'border-box',
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeaderStyled>
                <IconButton onClick={click}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeaderStyled>
            <Divider />
            {children}
        </Drawer>
    )
}
 
export default AppDrawer