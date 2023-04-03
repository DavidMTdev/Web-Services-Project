import React, { useState } from 'react'
import { useQueryClient, useMutation } from "@tanstack/react-query"

import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'

import { deleteDatabase } from '../api/root'

const NestedListItem = ({ sx, text, click, isOpen, open, icon }) => {
  const queryClient = useQueryClient()
  const [show, setShow] = useState(false)
  const mutation = useMutation({
    mutationFn: () => deleteDatabase(text),
    onSuccess: () => {
      queryClient.invalidateQueries(["databases", "list", "all"])
    }
  })

  const handleDelete = () => {
    console.log('delete')
    mutation.mutate()
  }

  if (!open) {
    return (
      <ListItemButton sx={sx} onClick={click} >
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    )
  }

  return ( 
    <ListItemButton 
      sx={sx} 
      onClick={click}
      onMouseOver={() => setShow(true)}
      onMouseOut={() => setShow(false)}
    >
      {isOpen ? <ExpandLess /> : <ExpandMore />}
      {/* <ListItemIcon>
        {icon}
      </ListItemIcon> */}
      <ListItemText primary={text} />
      <ListItemIcon sx={{
          minWidth: 0,
        }} 
      >
        {/* {show &&  <DeleteForeverIcon sx={{
          opacity: 0.4,
        }} />} */}
        { show && <IconButton 
                    sx={{
                      opacity: 0.5,
                    }} 
                    aria-label="delete" 
                    size="small"
                    onClick={() => handleDelete()}
                  >
                    <DeleteForeverIcon fontSize="inherit" />
                  </IconButton>
        }
      </ListItemIcon>
    </ListItemButton>
  )
}
 
export default NestedListItem