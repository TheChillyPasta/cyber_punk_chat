import React from 'react'
import { ActionButton } from './atoms/Buttons'
import Avatar from './Avatar'
import IconWrapper, { StatusIcon , ChatIcon, MoreIcon} from './IconWrapper'
import Menu from './molecules/menus/Menu'
import MenuItem from './molecules/menus/MenuItem'

export default function ChatHeader() {
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)
  const open = Boolean(menuAnchor)

  const handleClick = (event :  React.MouseEvent<HTMLElement>) => {

    setMenuAnchor(event.currentTarget)

  }

  const handleClose = (event : React.MouseEvent<HTMLElement>) => {

    setMenuAnchor(null)
  
  }
  return (
    <header className='flex flex-row flex-nowrap px-3 py-2  bg-header-100  h-header justify-between align-center'>
        <div className='flex'>
        <Avatar />
        </div>
        <div className='flex gap-2 align-center relative'>
            <IconWrapper>
              <StatusIcon/>
            </IconWrapper>
            <IconWrapper>
              <ChatIcon />
            </IconWrapper>  
            <ActionButton active = {open} icon = {<MoreIcon />} onClick = {handleClick}   pos = "relative" >
           
            </ActionButton>
            <Menu open = {open} onClose = {handleClose}  >
                <MenuItem> New chat </MenuItem>
                <MenuItem>New group</MenuItem>  
                <MenuItem>Starred messages</MenuItem>  
                <MenuItem>Settings</MenuItem>  
                <MenuItem>Log out</MenuItem>  
            </Menu>  
        </div>
    </header>
  )
  }