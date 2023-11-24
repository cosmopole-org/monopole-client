
import { useEffect, useRef, useState } from "react";
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized';
import IRoom from "../../../../api/models/room";
import IMessage from "../../../../api/models/message";
import Message from "../embedded/Message";
import { useHookstate } from "@hookstate/core";
import { api } from "../../../..";
import $ from 'jquery';
import { MessageTypes } from "../../../../api/services/messenger.service";
import utils from "../../../utils";

let canvas = document.createElement('canvas');
let ctx = canvas.getContext("2d");

/* takes a string and a maxWidth and splits the text into lines */
// ctx is available in the parent scope. 
function fragmentText(text: string | undefined, maxWidth: number) {
    if (text === undefined) return 1;
    let arr = text.split(' ');
    let lineCount = 0;
    let temp = 0;
    arr.forEach(word => {
        if (ctx) {
            let wordWidth = ctx.measureText(word + ' ').width * 1.7;
            if (wordWidth > maxWidth) {
                while (wordWidth > maxWidth) {
                    lineCount++;
                    wordWidth -= maxWidth;
                }
                temp = wordWidth;
            } else if (temp + wordWidth > maxWidth) {
                lineCount++;
                temp = wordWidth;
            } else {
                temp += wordWidth;
            }
            temp += 20;
        }
    });
    if (temp > 0) lineCount += 1;
    return lineCount;
}

const DynamicHeightList = (props: { room: IRoom, messages: Array<IMessage>, messageCount: number, visibleItems: any, firstVisibleItemIndex: number, dayViewer: any }) => {

    let { messages } = props
    const listRef = useRef(null)

    useEffect(() => {
        if (listRef.current) {
            (listRef.current as any).scrollToRow(messages.length)
        }
        messages.forEach((message: IMessage, index: number) => {
            if ((message.type === MessageTypes.TEXT) && (message.data.text !== undefined) && (message.meta?.measuredHeight === undefined)) {
                utils.sizer.measureTextMessageHeight(message, index, messages)
            }
        })
    }, [messages])

    const myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })
    let _cache = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            keyMapper: (index: number) => messages[index]?.id
        })
    )
    const _rowRenderer = (data: { index: number, key: string, parent: any, style: any }) => {
        let { index, key, parent, style } = data
        if (messages[index] === undefined) {
            return (
                <div style={{ width: 100, height: 100 }} />
            )
        } else {
            let message = messages[index]
            let nextMessage: IMessage = messages[index + 1]
            let isLastOfSection = (nextMessage && (nextMessage.authorId !== message.authorId)) || !nextMessage
            let prevMessage: IMessage = messages[index - 1]
            let isFirstOfSection = (prevMessage && (prevMessage.authorId !== message.authorId)) || !prevMessage
            return (
                <CellMeasurer
                    cache={_cache.current}
                    columnIndex={0}
                    key={key}
                    rowIndex={index}
                    parent={parent}>
                    {(params: { measure: any }) => (
                        <div style={style} onLoad={params.measure}>
                            <Message
                                key={`chat-message-${message.id}`}
                                message={message}
                                side={message.authorId === myHumanId ? 'right' : 'left'}
                                messageType={message.type}
                                firstOfSection={isFirstOfSection}
                                lastOfSection={isLastOfSection}
                            />
                        </div>
                    )}
                </CellMeasurer>
            );
        }
    }

    return (
        messages.length > 0 ? (
            <AutoSizer>
                {(size: { width: number, height: number }) => (
                    <List
                        ref={element => {
                            if (element !== null) {
                                listRef.current = element as any;
                                setTimeout(() => {
                                    listRef.current && (listRef.current as any).scrollToRow(messages.length);
                                });
                            }
                        }}
                        key={'chat-messages-dynamic-list'}
                        data={messages}
                        deferredMeasurementCache={_cache.current}
                        overscanRowCount={0}
                        rowCount={messages.length + 1}
                        rowHeight={(params: any) => {
                            let message = messages[params.index];
                            if (message === undefined) {
                                return 56;
                            }
                            let height = 0;
                            if (message.type === 'photo') {
                                height = 212;
                            } else if (message.type === 'video') {
                                height = 212;
                            } else if (message.type === 'audio') {
                                height = 64;
                            } else if (message.type === 'workspace') {
                                height = 224;
                            } else if (message.type === 'storage') {
                                height = 224;
                            } else if (message.type === 'sticker') {
                                height = 224;
                            } else if (message.type === 'service') {
                                height = 32;
                            } else if (message.type === 'text') {
                                if (!message.meta) {
                                    utils.sizer.measureTextMessageHeight(message, params.index, messages)
                                }
                                height = message.meta.measuredHeight
                            }

                            return height;
                        }}
                        rowRenderer={_rowRenderer}
                        width={size.width}
                        height={size.height}
                    />
                )}
            </AutoSizer>
        ) : null
    )
}

export default DynamicHeightList;
