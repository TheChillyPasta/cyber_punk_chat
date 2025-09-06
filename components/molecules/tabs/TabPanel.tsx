import React from 'react'
import { NodeProps } from '../../../ts/props'
import clsx from 'clsx'

export interface TabPanelPropsType extends NodeProps{

}

export default function TabPanel( {children, ...props} : TabPanelPropsType ) {
  return (
    <div  className= {clsx()}>
        {children}
    </div>
  )
}
