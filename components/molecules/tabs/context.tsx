import React , { useEffect, useState, useRef, createContext, useContext, createRef, SetStateAction} from 'react'
import { ReactState, ElementRef } from '../../../ts';



export interface TabContextType {
    activeTabState : ReactState<string | number>;
    activeTabRef : ReactState<ElementRef>;
    tabRefsState : ReactState<Record<string, ElementRef<HTMLButtonElement>>>;
    tabContainerRef : ElementRef<HTMLDivElement>;
    activeTabMarker : ElementRef<HTMLDivElement>;

}




export const TabContext = createContext<TabContextType>({
    activeTabState : ["", ()=> {}],
    activeTabRef : [ createRef(), () => {}],
    tabRefsState : [{}, () => {}],
    tabContainerRef : createRef(),
    activeTabMarker : createRef()
})

export function TabContextProvider( {children, values = {}} : {
    children : React.ReactNode,
    values ?: TabContextType | {}
} )  {

    const activeTabState = useState<string | number>("")
    const activeTabRef = useState<ElementRef>( createRef() )
    const tabRefsState = useState<Record<string, ElementRef <HTMLButtonElement>> | {}>({})
    const tabContainerRef = useRef<HTMLDivElement>(null)
    const activeTabMarker = useRef<HTMLDivElement>(null)
    return (
        <TabContext.Provider value = {
            {
                activeTabRef,
                activeTabState,
                tabRefsState,
                tabContainerRef,
                activeTabMarker,
                ...values
            }
        } >
            {children}
        </TabContext.Provider>
    )

}

function useTabContext(){
    return useContext(TabContext)
}


export function useActiveTabState() {
    return useTabContext()["activeTabState"]
 
}

// export function useInitializeActiveTabState() : React.Dispatch<SetStateAction<string|number>> {
//     const [ activeTab , setActiveTab] =  useContext(TabContext)["activeTabState"]

//     return setActiveTab

// }

export function useActiveTabRefState() {
    // const [ activeTabPosition] = useTabContext()["activeTabRef"]
    
    return useTabContext()["activeTabRef"]
}

export function useUpdateActiveTabRefState(  ) {
    const[, setActiveTabPositionState] = useTabContext()["activeTabRef"]

    return setActiveTabPositionState
}   




export function useTabContainerRef() {
    return useTabContext()["tabContainerRef"]
}



export function useActiveTabMarkerRef(){

    return useTabContext()["activeTabMarker"]
}


export function useTabRefs() {
   
    // const [tabRefs] = useTabContext()["tabRefsState"] 
    return useTabContext()["tabRefsState"] 

}

export function useRefWithId(id : string | number) {

    const[ tabRefs] = useTabContext()["tabRefsState"] 
    
    return tabRefs[id]

}

export function useUpdateTabRefState ( id : string | number) {
    
    const [tabRefs, setRef] = useTabContext()["tabRefsState"] 
    const ref = useRef<HTMLButtonElement>(null)

    setRef({...tabRefs, id : ref}  )
    return ref
}

export function useUpdateTabRefsState( ){
   const [tabRefs , addRefs] = useTabContext()["tabRefsState"] 

   return addRefs
}