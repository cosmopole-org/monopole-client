
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SigmaRouter, headerImageAddress, themeColor } from '../../../App';
import { hookstate, useHookstate } from '@hookstate/core';
import Image from '../../custom/components/Image';
import IRoom from '../../../api/models/room';
import Viewerjs from 'viewerjs'
import 'viewerjs/dist/viewer.css'

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
                })
            }
            viewer.current = new Viewerjs(container, {
                hide: () => close()
            });
            viewer.current.show()
        }
    }, [])

    const buildImageLoader = (docId: string) => {
        return (
            <Image
                onImageLoad={(url: string) => {
                    gallery[docId].set(url);
                    if (imageListContainerRef.current) {
                        document.getElementById(`gallery-item-'${docId}`)?.setAttribute('src', url);
                        (viewer.current as Viewerjs).update();
                        if (props.otherDocIds) {
                            (viewer.current as Viewerjs).view(props.otherDocIds.indexOf(props.docId));
                        } else {
                            (viewer.current as Viewerjs).view(0);
                        }
                    }
                }}
                docId={docId}
                room={props.room}
                tag={`gallery-photo-${docId}`}
                style={{
                    display: 'none',
                    width: Math.min(window.innerWidth, window.innerHeight),
                    height: Math.min(window.innerWidth, window.innerHeight),
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            />
        )
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {
                props.otherDocIds ?
                    props.otherDocIds.map(docId => {
                        return buildImageLoader(docId)
                    }) :
                    buildImageLoader(props.docId)
            }
            <div ref={imageListContainerRef} />
        </div >
    )
}

export default Gallery
