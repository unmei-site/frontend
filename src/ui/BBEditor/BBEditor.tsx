import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBold,
    faExclamationTriangle,
    faItalic,
    faStrikethrough,
    faTint,
    faUnderline
} from "@fortawesome/free-solid-svg-icons";
import './BBEditor.sass';
import TextField from "../TextField/TextField";

interface Props extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    inputRef: React.RefObject<HTMLTextAreaElement>
}

const BBEditor = ({ inputRef, ref, ...props }: Props) => {
    const [text, setText] = useState('');

    const addTag = (event: React.MouseEvent, tag: string, defaultValue?: string) => {
        event.preventDefault();
        const [start, end] = [inputRef.current!!.selectionStart, inputRef.current!!.selectionEnd];

        const openTag = `${tag}${defaultValue ? `=${defaultValue}` : ''}`;
        setText(`${text.slice(0, start)}[${openTag}]${text.slice(start, end)}[/${tag}]${text.slice(end, text.length)}`)
        inputRef.current!!.focus();
    }

    return (
        <div style={{ width: '100%' }}>
            <div className="BBCodes">
                <FontAwesomeIcon onClick={event => addTag(event, 'b')} icon={faBold}/>
                <FontAwesomeIcon onClick={event => addTag(event, 'i')} icon={faItalic}/>
                <FontAwesomeIcon onClick={event => addTag(event, 'u')} icon={faUnderline}/>
                <FontAwesomeIcon onClick={event => addTag(event, 's')} icon={faStrikethrough}/>
                <FontAwesomeIcon onClick={event => addTag(event, 'spoiler')} icon={faExclamationTriangle}/>
                <FontAwesomeIcon onClick={event => addTag(event, 'color', 'white')} icon={faTint}/>
            </div>
            <TextField
                ref={inputRef}
                style={{ width: '100%' }}
                value={text}
                onChange={event => setText(event.target.value)}
                {...props}
            />
        </div>
    )
}

export default BBEditor;
