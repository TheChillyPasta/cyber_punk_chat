'use client'
import React, { SetStateAction } from 'react'
import clsx from 'clsx'
import css from './style.module.scss'
import { NodeProps } from '../../../ts/props'


export interface MenuPropsType extends NodeProps {
  open : boolean;
  onClose ?:  React.Dispatch<SetStateAction<any>>;
  onClick ?:  React.Dispatch<SetStateAction<any>> ;
  anchor ?: HTMLElement | null;

}



export default function Menu( {children,cx, sx,open, onClose, onClick,anchor, ...props} : MenuPropsType ) 
{

  const menuContainerRef = React.useRef<HTMLDivElement>(null)
  
  const[localState, setLocalState] = React.useState<Boolean>(false)
  

  React.useEffect(( ) => {
    
   setTimeout( () => {setLocalState(open)} , 200 )

  }, [open])


  function handleClicks( event :  MouseEvent){

    if(!localState)
      return;
    
    const currentElement = event.target
    
    console.log("currentElement -> ", currentElement, anchor)

    // @ts-ignore 
    const query =  currentElement?.closest(".wasm-menu-container")


    const menuContainerElement = menuContainerRef.current
    console.log( "hey", query, menuContainerElement ) 

    if( menuContainerElement && !query  )
    {
      menuContainerElement.classList.toggle("animate-reverse-scale-popup");
    }

  }

   
  function handleAnimation (event : React.AnimationEvent<HTMLElement>){

    console.log(event)
    if(event.animationName === "scale-popup"){
      menuContainerRef.current?.classList.remove("animate-scale-popup")
    }
    else
    if(event.animationName === "reverse-scale-popup"){
      onClose && onClose(false)
    }

  }

  React.useEffect(( ) => {


    window.addEventListener( 'click', handleClicks)

    return () => {
      window.removeEventListener('click', handleClicks)
    }

  } , [ localState])


  if( !open )
  return (
      <> </>
  );

  return (
    <div onAnimationEnd={ handleAnimation}  ref = {menuContainerRef} className = {clsx( css.menu_container, 'wasm-menu-container  p-2 absolute right-2 top-9 animate-scale-popup origin-top-right ', cx)}>
        <ul  className = {clsx( css.menu_item_box , ' rounded bg-menu-default shadow-menu  flex flex-col  h-auto w-auto py-3' )} >
            {children}
        </ul>
    </div>
  )
}
