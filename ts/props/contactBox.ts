import { StaticImageData } from 'next/image';

export interface ContactInfoType {
    name : string;
    avatar : string | StaticImageData;
}
export type ContactListType  = ContactInfoType[]
