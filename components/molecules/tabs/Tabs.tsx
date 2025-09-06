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
    useUpdateActiveTabRefState,
    useRefWithId
} 

from './context'




export default function Tabs(props: TabsPropsType) {

    const {
        children,
        cx,
        sx,
        onChange = () => {},
        direction = "row",
        gap = 2,
        selected = null,
    } = props
 
    const [activeTab] = React.useContext(TabContext)["activeTabState"]
    const [activeTabRef] = useActiveTabRefState()
    const tabContainerRef = useTabContainerRef()
    const activeTabMarkerRef = useActiveTabMarkerRef()
    const [, updateActiveTabState] = useActiveTabState()

    // @ts-ignore 
    // const viewPortValue = React.useSyncExternalStore( (listener : any) => {
    //     window.addEventListener('resize', listener)
    //     return () => {
    //         window.removeEventListener('resize', listener)
    //     }
    // }, () => window.innerWidth)

    function updateMarkerPosition() {

        if(!tabContainerRef || !activeTabRef || !activeTabMarkerRef)
        return;

        const tabContainerElement = tabContainerRef.current;
        const activeTabElement = activeTabRef.current;
        const markerElement = activeTabMarkerRef.current;

        if(!tabContainerElement || !activeTabElement || !markerElement)
            return;

        const containerPosition = tabContainerElement.getBoundingClientRect()
        const activeTabPosition = activeTabElement.getBoundingClientRect()

        const move_x = Math.max(activeTabPosition.left - containerPosition.left, 0);
        const move_y = Math.max(activeTabPosition.top - containerPosition.top, 0);

        

        if (direction === "row")
            markerElement.style.left = `calc( ${move_x}px   ) `;
        else
            markerElement.style.top = `${move_y}px`;
    }


    React.useEffect(() => {

        updateMarkerPosition()


    }, [ tabContainerRef, activeTabRef, activeTabMarkerRef])

    useEffect(() => {
        window.addEventListener('resize', updateMarkerPosition)
        return () => {
            window.removeEventListener('resize', updateMarkerPosition)
        }

    }, [])
    
    useEffect(( ) => {

        onChange && onChange(activeTab)

    }, [activeTab])


    // useEffect(( ) => {

    //     if(activeTab == selected)
    //     return;

    //     updateActiveTabState(selected)

    // }, [selected])


    const defaultGap  = gap*4;

    return (
            <div 
                ref={tabContainerRef} 
                className={clsx(["flex  relative", css.tabs_container, `flex-${direction} gap-${gap}`,
                direction === "row" ? " w-full h-tabs" : "h-full w-tabs"
            ])}>
                < div
                    className={
                        clsx("absolute bg-tab_marker ", css.active_tab_indicator,
                            direction === "row" ? "bottom-0 left-0" : "top-0 right-0"
                        )}
                    style={{
                        width: (direction === "row" ? `calc( 100% / ${children && children.length} - ${defaultGap}px )` : "4px"),
                        height: (direction === "row" ? "4px" : `calc( 100% / ${children && children.length} - ${defaultGap * 4}px )`)

                    }}
                    ref={activeTabMarkerRef}
                >
                </div>
                    {children}
            </div>
    )
}


 