import * as React from 'react';
import { useState, useRef } from 'react';
import IRoom from '../../../api/models/room';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import config from '../../../config';
import SliderPage from '../../layouts/SliderPage';
import { url } from 'inspector';

const format = (seconds: any) => {
  if (isNaN(seconds)) {
    return '00:00'
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`
  } else {
    return `${mm}:${ss}`
  }
};

function VideoPlayer(props: { docId: string, room: IRoom, isOnTop: boolean, id: string }) {
  let { docId } = props
  const [playerstate, setPlayerState] = useState({
    playing: true,
    muted: true,
    volume: 0.5,
    playerbackRate: 1.0,
    played: 0,
    seeking: false,
  });
  const playerRef = useRef(null);
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

  const { playing, muted, volume, playerbackRate, played, seeking } = playerstate;

  const handlePlayAndPause = () => {
    //setPlayerState({ ...playerstate, playing: !playerstate.playing })
  }

  const handleMuting = () => {
    //setPlayerState({ ...playerstate, muted: !playerstate.muted })
  }

  const handleRewind = () => {
    // if (playerRef.current) {
    //   (playerRef.current as any).seekTo((playerRef.current as any).getCurrentTime() - 10)
    // }
  }

  const handleFastForward = () => {
    // if (playerRef.current) {
    //   (playerRef.current as any).seekTo((playerRef.current as any).getCurrentTime() + 30)
    // }
  }

  const handleVolumeChange = (e: any, newValue: number) => {
    //setPlayerState({ ...playerstate, volume: Math.floor(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handleVolumeSeek = (e: any, newValue: number) => {
    //setPlayerState({ ...playerstate, volume: Math.floor(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handlePlayerRate = (rate: any) => {
    //setPlayerState({ ...playerstate, playerbackRate: rate });
  }

  const handlePlayerProgress = (state: any) => {
    // console.log('onProgress', state);
    // if (!playerstate.seeking) {
    //   setPlayerState({ ...playerstate, ...state });
    // }
    // console.log('afterProgress', state);
  }

  const handlePlayerSeek = (e: any, newValue: number) => {
    // setPlayerState({ ...playerstate, played: Math.floor(newValue / 100) });
    // if (playerRef.current) {
    //   (playerRef.current as any).seekTo(Math.floor(newValue / 100));
    // }
  }

  const handlePlayerMouseSeekDown = (e: any) => {
    //setPlayerState({ ...playerstate, seeking: true });
  }

  const handlePlayerMouseSeekUp = (e: any, newValue: number) => {
    // setPlayerState({ ...playerstate, seeking: false });
    // if (playerRef.current) {
    //   (playerRef.current as any).seekTo(Math.floor(newValue / 100));
    // }
  }

  const currentPlayerTime = playerRef.current ? (playerRef.current as any).currentTime : '00:00';
  const movieDuration = playerRef.current ? (playerRef.current as any).duration : '00:00';
  const playedTime = format(currentPlayerTime);
  const fullMovieTime = format(movieDuration);

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
