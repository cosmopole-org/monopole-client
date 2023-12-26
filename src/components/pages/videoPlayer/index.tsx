import * as React from 'react';
import { useState } from 'react';
import IRoom from '../../../api/models/room';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import SliderPage from '../../layouts/SliderPage';

function VideoPlayer(props: { docId: string, room: IRoom, isOnTop: boolean, id: string }) {
  let { docId } = props
  const [, setPlayerState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playerbackRate: 1.0,
    played: 0,
    seeking: false,
  });
  const close = React.useCallback(() => {
    SigmaRouter.back()
  }, [])

  React.useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Video Player')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [props.isOnTop])

  React.useEffect(() => {
    if (docId) {
      setPlayerState({
        playing: true,
        muted: true,
        volume: 0.5,
        playerbackRate: 1.0,
        played: 0,
        seeking: false,
      });
    }
  }, []);

  const [link, setLink] = useState('')

  React.useEffect(() => {
    api.services.file.generateDownloadLink({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId }).then((link: string) => {
      setLink(link)
    })
  }, [])

  return (
    <SliderPage id={props.id}>
      <div style={{ width: '100%', height: '100%', backgroundColor: themeColor.get({ noproxy: true })[50] }}>
        {
          link.length > 0 ? (
            <video
              autoPlay
              controls
              style={{ width: '100%', height: 'auto', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}
            >
              <source src={link} type="video/mp4" />
            </video>
          ) :
            null
        }
      </div>
    </SliderPage>
  );
}

export default VideoPlayer;
