'use client'
import React from 'react'
import Avatar from './Avatar'
import IconWrapper, { MoreIcon, SearchIcon } from './IconWrapper'
import css from './styles/conversationheader.module.scss'
import { ActionButton } from './atoms/Buttons'
import Menu from './molecules/menus/Menu';
import MenuItem from './molecules/menus/MenuItem';


export default function ConversationHeader() {

  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)
  const open = Boolean(menuAnchor)

  const handleClick = (event :  React.MouseEvent<HTMLElement>) => {

    setMenuAnchor(event.currentTarget)

  }

  const handleClose = (event : React.MouseEvent<HTMLElement>) => {

    setMenuAnchor(null)
  
  }

  return (
    <header className={` ${css.conversation_header} flex flex-row flex-nowrap bg-header-100 px-3  h-header border-l border-solid border-l-main justify-end items-center`} >
        <div className = {` ${css.inner} flex flex-row basis-full gap-3 items-center justify-start`}>
          <Avatar />
          <div className={` ${css.contact_title} `}>
            <p className=' text-main-primaryhard text-base'>
              Ayush Bisht
            </p>
            <p className='text-main-secondary text-xs'>
              last seen 10:00pm
            </p>
          </div>
        </div>

        <div className={`${css.header_options} basis-1/4 flex flex-row align-center justify-end px-2 relative`}>
            <IconWrapper>
              <SearchIcon />
            </IconWrapper>
            <ActionButton 
              icon = {<MoreIcon />} onClick = {handleClick}   pos = "relative" 
              active = {open}
              >
            </ActionButton>
            <Menu 
              open = {open} 
              onClose = {handleClose} 
              anchor = {menuAnchor}  
              >
                <MenuItem> Contact info </MenuItem>
                <MenuItem>Select messages</MenuItem>  
                <MenuItem>Close chat</MenuItem>  
                <MenuItem>Unmute notifications</MenuItem>  
                <MenuItem>Clear messages</MenuItem>
                <MenuItem>Delete chat</MenuItem>  
                <MenuItem>Report</MenuItem>  
                <MenuItem>Block</MenuItem>  
              </Menu>  
        </div>
    </header>
  )
}
