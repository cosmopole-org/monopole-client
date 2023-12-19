import React, { useEffect, useRef, useState } from "react";
import SliderPage from "../../layouts/SliderPage";
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar";
import { SigmaRouter, themeColor } from "../../../App";
import { Grid, IconButton, Paper, Slide, Slider, Typography } from "@mui/material";
import { FastForward, FastRewind, Pause, PlayArrow, Repeat, Shuffle, Tag } from "@mui/icons-material";
import SigmaFab from "../../custom/elements/SigmaFab";
import AudioCard from "../../custom/components/AudioCard";
import IRoom from "../../../api/models/room";
import { api } from "../../..";

let audio: any = undefined;
let playingDocId = '';
let link = '';
let playing = false;
let repeat = false;
let shuffle = false;

let duration = '00:00';
let progress = '00:00';
let progressNumber = 0;
let otherDocIds: any = []
let room: any = undefined
let loading = false;

export let isPlaying = (docId: string) => (playing && (docId === playingDocId))
export let isLoading = (docId: string) => (loading && (docId === playingDocId))

let progressStore: { [id: string]: number } = {}
export let getProgress = (docId: string) => progressStore[docId]
let progressListeners: { [id: string]: any } = {}
export let registerAudioProgressListener = (docId: string, listener: any) => {
  progressListeners[docId] = listener;
  if (audio && playingDocId) {
    if (playingDocId === docId) {
      return progressStore[docId];
    }
  }
  return 0;
}
export let unregisterAudioProgressListener = (docId: string) => {
  delete progressListeners[docId];
}
let playListeners: { [id: string]: any } = {}
export let registerAudioPlayListener = (docId: string, listener: any) => {
  playListeners[docId] = listener;
  return 0;
}
export let unregisterAudioPlayListener = (docId: string) => {
  delete playListeners[docId];
}

export let seekAudioTo = (docId: string, percent: number) => {
  if (docId === playingDocId) {
    if (audio) {
      try {
        audio.currentTime = percent * audio.duration / 100;
        return true;
      } catch (ex) { console.log(ex) }
    }
  }
  return false;
}

const formatTime = (seconds: number) => {
  let currentMinutes = Math.floor(seconds / 60).toString();
  if (currentMinutes.length === 1) currentMinutes = '0' + currentMinutes;
  if (currentMinutes.startsWith('N')) currentMinutes = '00';
  let currentSeconds = Math.floor(seconds % 60).toString();
  if (currentSeconds.length === 1) currentSeconds = '0' + currentSeconds;
  if (currentSeconds.startsWith('N')) currentSeconds = '00';
  return (currentMinutes + ':' + currentSeconds);
}

const resetAudioPlayer = () => {
  playing = false;
  try {
    audio.pause();
  } catch (ex) { console.log(ex) }
  duration = '00:00';
  progress = '00:00';
  progressNumber = 0;
}

const loadAudio = async (docId: string, room: any) => {
  return new Promise(async resolve => {
    let progress = progressStore[docId];
    playingDocId = docId;
    loading = true;
    let callback = playListeners[playingDocId];
    if (callback) {
      callback();
    }
    try {
      audio.pause();
    } catch (ex) { console.log(ex) }
    let l = await api.services.file.generateDownloadLink({ towerId: room.towerId, roomId: room.id, documentId: playingDocId });
    link = l;
    let a = new Audio(link);
    a.autoplay = false;
    a.loop = false;
    audio = a
    audio.onloadedmetadata = () => {
      if (progress !== undefined) {
        try {
          audio.currentTime = Math.floor(progress * audio.duration / 100);
        } catch (ex) {
          console.log(ex)
        }
      }
      loading = false;
      resolve(true);
    }
  })
}

setInterval(() => {
  if (audio) {
    duration = formatTime(audio.duration);
    if (playing && audio.paused) {
      if (repeat) {
        // do nothing
      } else {
        playing = !audio.paused;
      }
    } else {
      playing = !audio.paused;
    }
    if (audio.ended) {
      audio.currentTime = 0;
      let callback = playListeners[playingDocId];
      if (callback) {
        callback();
      }
      if (repeat) {
        try {
          audio.play().catch((ex: any) => console.log(ex));
        } catch (ex) { console.log(ex) }
      } else {
        let nextDocId = undefined;
        if (shuffle) {
          nextDocId = otherDocIds[Math.floor(Math.random() * otherDocIds.length)];
        }
        //  else {
        //   let currentIndex = otherDocIds.indexOf(playingDocId);
        //   nextDocId = otherDocIds[currentIndex + 1]
        //   if (nextDocId === undefined) nextDocId = otherDocIds[0]
        // }
        if (nextDocId !== undefined) {
          loadAudio(nextDocId, room).then(() => {
            try {
              audio.play().catch((ex: any) => console.log(ex));
            } catch (ex) { console.log(ex) }
          })
        }
      }
    }
    progress = formatTime(audio.currentTime);
    progressNumber = audio.currentTime * 100 / audio.duration;
    progressStore[playingDocId] = progressNumber;
    if (!audio.paused) {
      let callback = progressListeners[playingDocId];
      if (callback) {
        callback(progressStore[playingDocId]);
      }
    }
  }
}, 1000);

export let togglePlay = (v: boolean) => {
  playing = v;
  try {
    if (v) {
      audio.play().catch((ex: any) => console.log(ex));
    } else {
      audio.pause();
    }
    let callback = playListeners[playingDocId];
    if (callback) {
      callback();
    }
  } catch (ex) { console.log(ex) }
}
export let playAudio = (docId: string, r?: IRoom, oids?: any) => {
  if (r) {
    room = r;
    otherDocIds = oids;
  }
  if (playingDocId === docId) {
    togglePlay(true);
  } else {
    if (playingDocId) {
      togglePlay(false)
    }
    loadAudio(docId, room).then(() => {
      togglePlay(true);
    });
  }
}

export default (props: { id: string, isOnTop: boolean, otherDocIds: Array<string>, room: IRoom, docId?: string }) => {
  const [_, setTrigger] = useState(1);
  const update = () => setTrigger(Math.random());
  const close = () => SigmaRouter.back();
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Audio Player')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [props.isOnTop]);
  useEffect(() => {
    if (props.room && props.docId && (props.docId !== playingDocId)) {
      room = props.room;
      otherDocIds = props.otherDocIds;
      resetAudioPlayer();
      playAudio(props.docId);
    }
    let timeGuard = setInterval(() => {
      update();
    }, 1000)
    return () => {
      clearInterval(timeGuard)
    }
  }, []);
  return (
    <SliderPage id={props.id}>
      <div style={{
        height: '100%',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: themeColor.get({ noproxy: true })[50]
      }}>
        <div style={{ width: '100%', height: 'calc(100% - 208px)', overflowY: 'auto' }}>
          <div style={{ width: '100%', height: 72 }} />
          <Grid container columns={2}>
            {
              room && otherDocIds?.map((docId: string) => {
                return (
                  <Grid item xs={1}>
                    <AudioCard docId={docId} room={room} playing={playing && (playingDocId === docId)} onPlayPause={() => {
                      if (playing) {
                        if (docId === playingDocId) {
                          togglePlay(false);
                          update();
                        } else {
                          togglePlay(false);
                          playAudio(docId);
                        }
                      } else {
                        playAudio(docId);
                      }
                    }} />
                  </Grid>
                )
              })
            }
          </Grid>
          <div style={{ width: '100%', height: 16 }} />
        </div>
        <Paper
          style={{
            padding: '25px 30px',
            overflow: 'hidden',
            position: 'absolute',
            borderRadius: 0,
            left: 0,
            bottom: 0,
            width: 'calc(100% - 56px)',
            backgroundColor: themeColor.get({ noproxy: true })[100]
          }}>
          <Paper elevation={0} style={{
            width: '100%',
            height: 256,
            borderRadius: 16,
            backgroundColor: themeColor.get({ noproxy: true })[50],
            display: 'none'
          }}>
            <img
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16
              }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZhh9hNJIu0WJHtzpNO43mhRY1y_OqqT6pHdepd_3A4g&s"
              alt=""
            />
          </Paper>
          <Slider style={{ width: '100%' }} value={progressNumber}
            onChange={(e: any, value: any) => {
              if (audio) {
                try {
                  audio.currentTime = value * audio.duration / 100;
                } catch (ex) { console.log(ex); }
              }
            }} />
          <div style={{ width: '100%', display: 'flex' }}>
            <Typography>
              {progress}
            </Typography>
            <div style={{ flex: 1 }} />
            <Typography>
              {duration}
            </Typography>
          </div>
          <div style={{ margin: '24px 0px 5px 0px', display: 'flex', width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton style={{ borderRadius: '50%', backgroundColor: shuffle ? themeColor.get({ noproxy: true })[50] : 'transparent', marginLeft: 8, marginRight: 8 }}
              onClick={() => { shuffle = !shuffle; update(); }}>
              <Shuffle />
            </IconButton>
            <IconButton style={{ marginLeft: 8, marginRight: 8 }} onClick={() => {
              if (audio) {
                audio.currentTime -= 5;
                update();
              }
            }}>
              <FastRewind />
            </IconButton>
            <SigmaFab style={{ marginLeft: 8, marginRight: 8 }} onClick={() => {
              if (otherDocIds && (otherDocIds.length > 0)) {
                togglePlay(!playing)
                update();
              }
            }}>
              {playing ? <Pause /> : <PlayArrow />}
            </SigmaFab>
            <IconButton style={{ marginLeft: 8, marginRight: 8 }} onClick={() => {
              if (audio) {
                audio.currentTime += 5;
                update();
              }
            }}>
              <FastForward />
            </IconButton>
            <IconButton style={{ borderRadius: '50%', backgroundColor: repeat ? themeColor.get({ noproxy: true })[50] : 'transparent', marginLeft: 8, marginRight: 16 }}
              onClick={() => { repeat = !repeat; update(); }}>
              <Repeat />
            </IconButton>
          </div>
        </Paper>
      </div>
    </SliderPage>
  )
}
