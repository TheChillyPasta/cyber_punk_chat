import React from 'react'
import { textPropsType } from '../ts/props'


enum textType {
    primary = "",
    secondary = "",
    muted = "",
}

export default function Text(props : textPropsType) {
  
    const{
        cx,
        sx,
        children,
        type,

    } = props;
  
    return (
    <p className = {``} >
        {children}
    </p>
  )
}
