'use client'

import React, 
{ useState, useEffect, useRef, createContext, useReducer, SetStateAction, createRef } 
from 'react'
import { TabsPropsType, TabPropsType } from '../../../ts/components/tabs'
import { Button, TabButton } from '../../atoms/Buttons'
import css from './tabs.module.scss'
import { useContext } from 'react'
import clsx from 'clsx'
import { 
    TabContextProvider, 
    useActiveTabMarkerRef,  
    useUpdateTabRefsState, 
    useActiveTabRefState, 
    useActiveTabState, 
    useTabContainerRef ,
    TabContext,
    useTabRefs,
    TabContextType
} 
from './context'
import { NodeProps } from '../../../ts/props'


export interface TabsContainerPropsType extends NodeProps{
    contextValues ?: TabContextType | {}
}


export default function TabsContainer( { children, contextValues = {}, ...props}  : TabsContainerPropsType ) {
  return (
    <div className = {clsx()} > 
      <TabContextProvider  values = {contextValues} >
            {children}
        </TabContextProvider>
    </div>
  )
}
