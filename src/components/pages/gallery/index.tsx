
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useCallback, useEffect, useRef } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import { hookstate, useHookstate } from '@hookstate/core';
import IRoom from '../../../api/models/room';
import Viewerjs from 'viewerjs'
import 'viewerjs/dist/viewer.css'
import { api } from '../../..';

let giDefault: { [id: string]: string } = {}
let galleryImages = hookstate(giDefault)

const Gallery = (props: { id: string, isOnTop: boolean, room: IRoom, docId: string, otherDocIds?: Array<string> }) => {
    const viewer: any = useRef()
    const gallery = useHookstate(galleryImages)
    const imageListContainerRef = useRef(null)
    const close = useCallback(() => {
        SigmaRouter.back()
    }, [])
    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('photo')
            switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
        }
    }, [props.isOnTop])
    useEffect(() => {
        if (imageListContainerRef.current) {
            let container = imageListContainerRef.current as HTMLElement
            if (props.otherDocIds) {
                props.otherDocIds.forEach(docId => {
                    let imageEl = document.createElement('img');
                    imageEl.setAttribute('id', `gallery-item-'${docId}`);
                    container.appendChild(imageEl);
                    api.services.file.listenToFileTransfer(`gallery-item-${docId}`, docId + '-preview', (body: { data: Blob, newChunk?: any, end?: boolean }) => {
                        imageEl.setAttribute('src', URL.createObjectURL(body.data))
                    })
                    api.services.file.prevDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: docId })
                });
            } else {
                let imageEl = document.createElement('img');
                imageEl.setAttribute('id', `gallery-item-'${props.docId}`);
                container.appendChild(imageEl);
                api.services.file.listenToFileTransfer(`gallery-item-${props.docId}`, props.docId + '-preview', (body: { data: Blob, newChunk?: any, end?: boolean }) => {
                    imageEl.setAttribute('src', URL.createObjectURL(body.data))
                })
                api.services.file.prevDown({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId });
            }
            viewer.current = new Viewerjs(container, {
                zoomRatio: 3,
                hide: () => close(),
                viewed(event) {
                    viewer.current.zoomTo(2);
                    let di = props.docId
                    if (props.otherDocIds) {
                        di = props.otherDocIds[event.detail.index]
                    }
                    api.services.file.download({
                        downloadType: api.services.file.downloadTypes.DOCUMENT,
                        towerId: props.room.towerId,
                        roomId: props.room.id,
                        documentId: di,
                        onChunk: (data: any) => { },
                        onResult: (data: any) => {
                            let url = URL.createObjectURL(new Blob(data, { type: 'image/jpg' }))
                            gallery[di].set(url)
                            event.detail.image.src = url
                        }
                    });
                },
            });
            if (props.otherDocIds) {
                (viewer.current as Viewerjs).view(props.otherDocIds.indexOf(props.docId));
            } else {
                (viewer.current as Viewerjs).view(0);
            }
            viewer.current.show()
        }
    }, [])

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <div ref={imageListContainerRef} />
        </div >
    )
}

export default Gallery
