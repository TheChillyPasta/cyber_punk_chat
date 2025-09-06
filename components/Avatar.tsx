import React from 'react'
import Image, { StaticImageData } from 'next/image'
import avatar from '.././assets/images/avatar.jpg'

type AvatarProps = {
  children?: React.ReactNode; 
  sx?: React.CSSProperties;
  cx?: string; 
  title ?:string;
  src ?: StaticImageData | string
}

export default function Avatar(props : AvatarProps) {

  const{
    cx = "",
    sx = {},
    src = avatar
  } = props

  return (
    <div className = {`rounded-full h-10 w-10 cursor-pointer ${cx}`}>
      <Image 
        alt = "avatar"
        title = {props.title}
        src = {src}
        style = {{
          objectFit : "contain",
          ...sx
        }}
        className = {`rounded-full`}
      />
    </div>
  )
}
