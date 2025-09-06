import React, { useEffect} from 'react'
import { scrollTo } from '../../utils/scroll'
import { useEmojiContainerRef } from '../context/refContext'

export default function useScrollGroupInView( state : string | number ) : void {

    const containerRef = useEmojiContainerRef()

    useEffect(( )=> {
        const containerElement = containerRef.current       
        const targetGroup = containerElement?.querySelector(`#${state}`)

        if(!containerElement)
            return ;

        if(!targetGroup)
            return;
        
        try{

            // @ts-ignore
            const moveY = targetGroup?.offsetTop || 0;
         
            scrollTo(containerElement, moveY)

        }
        catch{
            console.log("error")
        }
     
      

    }, [state, containerRef])

}
