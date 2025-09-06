import React from 'react'
import css from './styles/chat_messages.module.scss'
import MsgBox from '../components/MsgBox'
import { useCookies } from 'react-cookie'


export default function ConversationPanelMessages(props:any) {

    const {
        messages
    } = props;

const [cookies, setCookie] = useCookies<any>( ['auth_token'] );

    console.log(messages, 'hello ', cookies, 'cookies')
    return (
        <div className={` ${css.msgBoxContainer} relative bg-gray-1000 border-l border-solid border-l-main overflow-auto`}>
            <div className= {`h-auto min-h-full ${css.chatBg} `}>
            {
                messages ? messages.map((msg : any) =><MsgBox msg={msg} type= { msg.sender === cookies?.email ? 'in' : 'out'} key={msg.id} /> ) : ""
            }
            </div>

        </div>
    )
}
