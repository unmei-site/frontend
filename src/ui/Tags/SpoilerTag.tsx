// @ts-ignore
import { Tag } from 'bbcode-to-react';
import Spoiler from "../Spoiler/Spoiler";
import React from 'react';

class SpoilerTag extends Tag {
    toReact() {
        // @ts-ignore
        return (<Spoiler>{this.getContent(true)}</Spoiler>)
    }
}

export default SpoilerTag;
