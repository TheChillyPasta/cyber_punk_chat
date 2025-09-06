'use client'
import React from 'react'
import css from './styles/messagebox.module.scss'
import clsx from 'clsx'

type msgProps = {
  children?: React.ReactNode;
  sx?: React.CSSProperties;
  cx?: string;
  type: string;
  msg: any;

}

export default function MsgBox(props: msgProps) {
  const {
    sx,
    cx,
    type = "in",
    msg={},
  } = props;
  return (
    <div className='h-auto p-2 w-full ' >
 
      <div
        className={clsx("flex  align-center w-full h-auto px-5 ", type == "out" ? ` justify-start ${css.outMsgBox}` : `justify-end ${css.inMsgBox}`)} >
        <div className={clsx(`max-w-17/20 w-auto px-3 px-2 relative `)}>
          <span 
          className={
            clsx(type == "out" ? `${css.msgHinge} ${css.outMsgHinge} bg-msg-out left-0 ` 
                               : `${css.msgHinge} ${css.inMsgHinge} bg-msg-in`)}>
          </span>
          <div 
          className={ 
            clsx(`p-2    h-auto w-auto text-main-primaryhard`, 
                  type == "out" ? "bg-msg-out rounded-r-msg rounded-b-msg" : "bg-msg-in rounded-l-msg rounded-b-msg"
            ) }>
            <div>
              {msg?.text}
              <span className={clsx("text-white-60 text-xs")} >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
              </span>
            </div>
            <div className={clsx(" w-auto h-auto text-white-60 text-xs float-right relative ml-[4px] mr-[0px] mt-[-10px] ")} >
              {/* <span> {msg?.timestamp.slice(2 )}</span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
