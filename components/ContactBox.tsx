import React, {useContext} from 'react'
import { NodeProps } from '../ts/props'
import { ContactInfoType } from '../ts/props/contactBox'
import Avatar from './Avatar'
import css from './styles/contactbox.module.scss'
import { useNavigate } from "react-router-dom";
import { ChatStore } from '../store/chatContext.jsx'

interface ContactBoxPropType extends NodeProps {
  contactDetails : ContactInfoType
}


export default function ContactBox( props : ContactBoxPropType ) {

  const chatStoreContext = useContext(ChatStore)
  
  const {
    currentChatIdState : [
      chatId,
      setChatId
    ]
  } : any = chatStoreContext;

  const{
    contactDetails
  }:any = props
  
  const handleClick =(event : any) => {
    event.preventDefault()
    setChatId(contactDetails?.id)
    console.log()

  }
  return (
    <div className = {`flex flex-row   h-contactbox cursor-pointer  bg-default hover:bg-hover ${css.contactBox}`}  onClick={handleClick} >
        <div className='basis-1/5 py-3 px-3'>
        <Avatar cx = "w-12 h-12" src = {contactDetails?.avatar} />

        </div>
        <div className= {`cursor-pointer contact-content basis-full border-main border-t  h-100 flex justify-center flex-col ${css.contactContent}`} >
            <div className='flex flex-row flex-nowrap '>
                <span className='basis-full text-main-primaryhard text-base text-ellipsis overflow-hidden'>{contactDetails?.name}</span>
                <span className='basis-1/6 text-main-primary text-xs leading-6 text-main-secondary text-ellipsis overflow-hidden'>
                0:28</span>
            </div>
            <p className='text-main-secondary text-xs text-ellipsis overflow-hidden'>
                123XXX12342
            </p>
        </div>
    </div>
  )
}
