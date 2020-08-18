import React from "react";
// @ts-ignore
import parser from 'bbcode-to-react';
import classNames from "../../classNames";
import './NewsPost.sass';

interface Props {
    title: string
    short_post: string
    author_id: number
    author: string
    date: Date
    className?: string
    onClick?: () => void
}

const NewsPost = (restProps: Props) => {
    const { title, short_post, author, author_id, className, onClick, ...props } = restProps;
    const date = new Date(restProps.date);

    return (
        <div className={classNames('Post', className)} {...props} onClick={onClick}>
            <div className="Post__Title">{title}</div>
            <pre className='Post__Content'>{parser.toReact(short_post)}</pre>
            <div className="Post__Footer">
                <div>
                    Автор: {author}
                </div>
                <div>Дата: {date.toLocaleDateString()}, {date.toLocaleTimeString()}</div>
            </div>
        </div>
    )
}

export default NewsPost;