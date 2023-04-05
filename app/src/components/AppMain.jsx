import {
  Outlet,
  } from "react-router-dom"

import MainStyled from './styles/Main'
import DrawerHeaderStyled from './styles/DrawerHeader'

const AppMain = ({ theme, open}) => {
  return ( 
    <MainStyled open={open}>
      <DrawerHeaderStyled />
      <Outlet />
    </MainStyled>
  )
}
 
export default AppMain