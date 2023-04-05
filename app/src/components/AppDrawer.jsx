import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'

import DrawerHeaderStyled from './styles/DrawerHeader'
import Logo from './Logo'

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
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-start" mx={2}>
                    <Logo sx={{
                        width: 24,
                        height: 24,
                    }} />
                    <Chip
                        label={'0.1.0'}
                        size="small"
                        sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.625rem', py: 0.25 } }}
                        component="a"
                        href="https://github.com/DavidMTdev/Web-Services-Project"
                        target="_blank"
                        clickable
                    />
                </Stack>
                {/* <IconButton onClick={click}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton> */}
            </DrawerHeaderStyled>
            <Divider />
            {children}
        </Drawer>
    )
}
 
export default AppDrawer