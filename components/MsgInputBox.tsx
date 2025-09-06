'use client'
import React, { useEffect, useState } from 'react'
import css from './styles/msg_input_box.module.scss'
import IconWrapper, { ClipIcon, EmojiIcon, MicIcon } from './IconWrapper';
import SearchBox, { InputBox } from './SearchBox';
import EmojiContainer from './emojis_picker/EmojiContainer';
import { ActionButton } from './atoms/Buttons';

export default function MsgInputBox(props: any) {

    const {sendMessage} = props;

    const [query, setQuery] = useState<string>("")

    const [openEmojis, toggleEmojis] = useState<boolean>(false)

    const handleClick = (event : React.BaseSyntheticEvent) => {

        toggleEmojis(prev => !prev)
    }

    useEffect(() => {
        console.log("msg input mounted")
    }, [])

    const onSubmit = () => {
        sendMessage(query)
    }

    return (
        <footer className={`${css.msg_input_container} w-full relative h-footer  bg-footer-100`} style ={{ isolation : "isolate" }} >
            <div className={`px-2 flex flex-row items-center justify-center bg-footer-100 gap-3 h-full w-full absolute z-10`}>
                <div className={`basis-1/8 flex flex-row`}>

                    <ActionButton title="emojis" icon = {<EmojiIcon />} active = {openEmojis} onClick = {handleClick} 
                        activeClass = " bg-transparent text-emerald-600 hover:text-emerald-500 "
                        >
                    </ActionButton>

                    <IconWrapper title="attach" >
                        <ClipIcon />
                    </IconWrapper>
                </div>
                <div className={`basis-full`} >
                    <InputBox cx = "h-input  bg-input-200" placeholder='Type a message' setQuery={setQuery} query={query} onSubmit={onSubmit} />
                </div>
                <div className='basis-12 flex  px-2'>
                    <IconWrapper title ="record">
                        <MicIcon />
                    </IconWrapper>
                </div>
            </div>
            <EmojiContainer open ={openEmojis}  />
        </footer>
    )
}
