// @ts-ignore
import { Tag } from 'bbcode-to-react';
import React from 'react';

class ColorTag extends Tag {
    toReact() {
        // @ts-ignore
        const text = this.getContent(true);
        // @ts-ignore
        const color = this.params.color;
        // @ts-ignore
        return <span style={{ color }}>{text}</span>;
    }
}

export default ColorTag;