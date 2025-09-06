import clsx from 'clsx'
import React, { useEffect, useRef } from 'react'
import { TabPropsType } from '../../../ts/components/tabs'
import { TabButton } from '../../atoms/Buttons'
import {
    useActiveTabRefState,
    useActiveTabState, useTabRefs, useUpdateTabRefsState
} from './context'
import { ElementRef } from '../../../ts'

const Tab = (props: TabPropsType) => {
    const {
        children,
        cx,
        sx,
        w,
        h,
        name,
        value,
        icon,
        tabIconStyles,
        tabIconClasses
    } = props;

    const tabRef = useRef<HTMLButtonElement>(null)
    const [activeTab, updateActiveTabState] = useActiveTabState()
    const [ activeTabRef , updateActiveTabRefState] = useActiveTabRefState()

    function handleClick (e: React.BaseSyntheticEvent) {
        console.log("handle clicks")
        updateActiveTabRefState(tabRef)
        updateActiveTabState(value)
    }

    const updateTabRefsState = useUpdateTabRefsState()
    const [tabRefsState] = useTabRefs()


    const IconClasses =  React.useMemo(() => {

        let style  = new Array()
        if(tabIconStyles)
        {   
            const tab_pos_mapper = {
                "center" : "top-0 left-0 right-0 bottom-0 m-auto",
                "left" : "left-0",
                "right" : "right-0",
            }
            style =[
                tab_pos_mapper[tabIconStyles?.position ? tabIconStyles?.position : "center"],
                `size-${tabIconStyles.size}`,
                `color-${tabIconStyles.color}`

            ]

        }
        return style

    }, [tabIconStyles]);

    
    // useEffect(() => {

    //     const refState : Record< string, ElementRef <HTMLButtonElement> > = {}
    //     refState[value] = React.createRef()
    //     console.log(tabRefsState, refState)

    //     if(tabRef.current){
    //         refState[value] = tabRef;
    //     }
    //     updateTabRefsState( {...tabRefsState, ...refState} )


    // }, [tabRef])

    useEffect(( ) => {

    
        if( activeTab == value && activeTabRef != tabRef){
            updateActiveTabRefState(tabRef)
            console.log("update active tab ref state")
        }

    }, [activeTab])

    return (

        <TabButton
            aria_selected={ activeTab == value}
            value={value}  onClick={(event) => handleClick(event)}
            cx={clsx([" h-full basis-0 grow text-sm relative text-icon-400 hover:text-icon-500 ", 
            activeTab === value ? "text-emerald-400" : ""
        ])}
            ref={tabRef}
        >
            <>
                {
                    name ? <p>{name}</p> : ""
                }
                {
                    icon ? <span className= {
                        clsx( "text-icon-500 hover:text-icon-400 left-0 right-0 top-0 bottom-0 m-auto h-6 w-6 absolute ",  
                        ...IconClasses, tabIconClasses,
                        activeTab === value && "text-icon-400"
                         )} > {icon} </span> : ""
                }
                {children}
            </>
        </TabButton>
    )
}


export default Tab;
