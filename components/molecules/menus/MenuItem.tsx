import React from 'react'
import css from './style.module.scss'
import clsx from 'clsx'
import { NodeProps } from '../../../ts/props'

export interface MenuItemPropsType extends NodeProps{

}


export default function MenuItem( {children, ...props} : MenuItemPropsType ) {
  return (
    <li className = {
        clsx(  " py-2 pl-5 font-medium  text-sm text-main-primary text-left hover:text-main-primaryhard bg-inherit hover:bg-menu-hover", css.menu_item )
        } >
      {children}      

    </li>
  )
}
