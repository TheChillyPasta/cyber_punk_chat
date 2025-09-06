'use client'
import React from 'react'
import css from './styles/searchbox.module.scss'
import {BiSearch} from 'react-icons/bi' 
import { SearchIcon } from './IconWrapper'

 

type InputProps = {
    placeholder : string;
    setQuery : React.Dispatch<React.SetStateAction<string>>;
    cx ?: string;
    sx ?: React.CSSProperties;
    query? : any;
    onSubmit ?:any;

}
export const InputBox = (props : InputProps) => {
    const{
        setQuery,
        query,
        onSubmit = () => {},
        placeholder,
        cx
    } = props
    
    const handleChange : React.ChangeEventHandler<HTMLInputElement> = (event) => {

        setQuery(event.currentTarget.value)
    }
    const handleKeyDown = (event:any) => {
        if (event.key == "Enter"){
            onSubmit(query)
        }
    }
    return (
        <div className= {`${css.inputBox} px-3 basis-full w-full h-full rounded-lg ${cx}`}  >
            <input className=' text-main-primaryhard text-sm w-full h-full '  
            type ="text" value={query} name="serach" placeholder={placeholder} onChange={ handleChange} onKeyDown={(event) => handleKeyDown(event)}  />
        </div>
    )
}

export default function SearchBox(props  : InputProps) {
    const{
        setQuery,
        placeholder,
        cx,
        sx
    } = props
    


  return (
    <div className= {` ${css.searchBox}  flex flex-row items-center py-2 px-3  h-searchbox bg-search-100 rounded-lg ${cx}`} >
        <span className = 'h-auto basis-5 text-icon-header hover:text-icon-400'>
            <SearchIcon />
        </span>
        <InputBox setQuery={setQuery} placeholder = {placeholder} />
    </div>


  )
}
