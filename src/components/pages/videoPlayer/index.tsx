import * as React from 'react';
import { useState, useRef } from 'react';
import IRoom from '../../../api/models/room';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import SliderPage from '../../layouts/SliderPage';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import dashjs from 'dashjs';
import config from '../../../config';

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

  React.useEffect(() => {
    var video,
      player: dashjs.MediaPlayerClass,
      url = `${config.GATEWAY_ADDRESS}/file/download?documentid=${props.docId}&videomoduletype=manifest`;
    video = document.getElementById("video-player") as HTMLVideoElement;
    player = dashjs.MediaPlayer().create();
    player.extend("RequestModifier", function () {
      return {
        modifyRequestHeader: function (xhr: any, urlHolder: { url: string }) {
          xhr.setRequestHeader('token', api.services.human.token)
          xhr.setRequestHeader('towerid', props.room.towerId)
          xhr.setRequestHeader('roomid', props.room.id)
          return xhr;
        },
        modifyRequestURL: function (url: string) {
          console.log(url)
          let moduleType = 'manifest';
          if (url.endsWith('.webm')) {
            moduleType = url.substring(url.lastIndexOf('-') + 1, url.length - 5)
          }
          return `${config.GATEWAY_ADDRESS}/file/download?documentid=${props.docId}&videomoduletype=${moduleType}`
        }
      };
    }, true);
    if (video) player.initialize(video, url, true);
    return () => {
      player.reset()
    }
  }, [])

  return (
    <SliderPage id={props.id}>
      <div style={{ width: '100%', height: '100%', backgroundColor: themeColor.get({ noproxy: true })[50] }}>
        <video id={'video-player'} className="video-js" controls preload="auto" style={{ width: '100%', height: 'auto', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
      </div>
    </SliderPage>
  );
}

export default VideoPlayer;
