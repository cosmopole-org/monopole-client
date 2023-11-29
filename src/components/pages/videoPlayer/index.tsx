import * as React from 'react';
import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import ControlIcons from './ControlIcons';
import IRoom from '../../../api/models/room';
import { SigmaRouter, themeColor } from '../../../App';
import { api } from '../../..';
import SliderPage from '../../layouts/SliderPage';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';

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
var streamingStarted = false;

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
  const [source, setSource] = useState('')

  React.useEffect(() => {
    if (api.services.human.token) {
      api.services.file.download({
        towerId: props.room.towerId,
        roomId: props.room.id,
        documentId: props.docId
      }).then(async response => {
        let myUrl = (window.URL || window.webkitURL).createObjectURL(await response.blob());
        setSource(myUrl)
      })
    }
  }, [])

  React.useEffect(() => {
    if (playerRef.current && source.length > 0) {
      setPlayerState({ ...playerstate, playing: true })
    }
  }, [source])

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
    setPlayerState({ ...playerstate, playing: !playerstate.playing })
  }

  const handleMuting = () => {
    setPlayerState({ ...playerstate, muted: !playerstate.muted })
  }

  const handleRewind = () => {
    if (playerRef.current) {
      (playerRef.current as any).seekTo((playerRef.current as any).getCurrentTime() - 10)
    }
  }

  const handleFastForward = () => {
    if (playerRef.current) {
      (playerRef.current as any).seekTo((playerRef.current as any).getCurrentTime() + 30)
    }
  }

  const handleVolumeChange = (e: any, newValue: number) => {
    setPlayerState({ ...playerstate, volume: Math.floor(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handleVolumeSeek = (e: any, newValue: number) => {
    setPlayerState({ ...playerstate, volume: Math.floor(newValue / 100), muted: newValue === 0 ? true : false, });
  }

  const handlePlayerRate = (rate: any) => {
    setPlayerState({ ...playerstate, playerbackRate: rate });
  }

  const handlePlayerProgress = (state: any) => {
    console.log('onProgress', state);
    if (!playerstate.seeking) {
      setPlayerState({ ...playerstate, ...state });
    }
    console.log('afterProgress', state);
  }

  const handlePlayerSeek = (e: any, newValue: number) => {
    setPlayerState({ ...playerstate, played: Math.floor(newValue / 100) });
    if (playerRef.current) {
      (playerRef.current as any).seekTo(Math.floor(newValue / 100));
    }
  }

  const handlePlayerMouseSeekDown = (e: any) => {
    setPlayerState({ ...playerstate, seeking: true });
  }

  const handlePlayerMouseSeekUp = (e: any, newValue: number) => {
    setPlayerState({ ...playerstate, seeking: false });
    if (playerRef.current) {
      (playerRef.current as any).seekTo(Math.floor(newValue / 100));
    }
  }

  const currentPlayerTime = playerRef.current ? (playerRef.current as any).getCurrentTime() : '00:00';
  const movieDuration = playerRef.current ? (playerRef.current as any).getDuration() : '00:00';
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

  return (
    <SliderPage id={props.id}>
      {
        source.length > 0 ? (
          <ReactPlayer
            url={source}
            playing={playing}
            width={'100%'}
            height={'100%'}
            ref={playerRef}
            volume={volume}
            onProgress={handlePlayerProgress}
            onEnded={() => setPlayerState({ ...playerstate, playing: false })}
            onPlay={() => setPlayerState({ ...playerstate, playing: true })}
            onPause={() => setPlayerState({ ...playerstate, playing: false })}
            muted={muted}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0
            }}
          />
        ) : null
      }
      <ControlIcons
        key={volume.toString()}
        playandpause={handlePlayAndPause}
        playing={playing}
        rewind={handleRewind}
        fastForward={handleFastForward}
        muting={handleMuting}
        muted={muted}
        volumeChange={handleVolumeChange}
        volumeSeek={handleVolumeSeek}
        volume={volume}
        playerbackRate={playerbackRate}
        playRate={handlePlayerRate}
        fullScreenMode={() => { }}
        played={played}
        onSeek={handlePlayerSeek}
        onSeekMouseUp={handlePlayerMouseSeekUp}
        onSeekMouseDown={handlePlayerMouseSeekDown}
        playedTime={playedTime}
        fullMovieTime={fullMovieTime}
        closePlayer={() => {
          setPlayerState({ ...playerstate, playing: false });
          close()
        }}
      />
    </SliderPage>
  );
}

export default VideoPlayer;
