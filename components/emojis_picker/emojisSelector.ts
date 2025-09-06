import { EmojiData, EmojiStyle } from "../../ts/emojis";
import skinToneVariations, {skinTonesMapped} from "./skinVariations";
import { EmojiProperties } from "../../ts/emojis";
import { cdnUrl } from "./cdnUrls";



export function getEmojisUrl(unified : string | undefined, style ?: EmojiStyle) : string {

    return `${cdnUrl(style) + unified}.png `

}


export function unifiedEmojisWithoutSkin( unified : string) : string {
    const splat = unified.split('-');
    const [skinTone] = splat.splice(1, 1);
  
    if (skinTonesMapped[skinTone]) {
      return splat.join('-');
    }
  
    return unified;
}

export function emojiHasVariations(emoji : EmojiData) : boolean | undefined{

    return (emoji[EmojiProperties.v] ?? [] ).length  > 0 ;

}


export function unifiedEmojis (emoji : EmojiData, skinTone ?: string) : string | undefined {

    const unified : string = emoji[EmojiProperties.u]

    if(!skinTone || !emojiHasVariations(emoji) )
    return unified;

    return unifiedEmojisVariations(emoji, skinTone);
}


export function unifiedEmojisVariations( emoji : EmojiData,skinTone ?: string ) : string | undefined  { 

    return skinTone ? (emoji[EmojiProperties.v] ?? []).find( (variations) => variations.includes(skinTone) ) : unifiedEmojis(emoji)

}