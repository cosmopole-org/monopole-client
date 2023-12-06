import React, { useEffect, useRef, useState } from "react";
import SliderPage from "../../layouts/SliderPage";
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar";
import { SigmaRouter, themeColor } from "../../../App";
import { Grid, IconButton, Paper, Slide, Slider, Typography } from "@mui/material";
import { FastForward, FastRewind, PlayArrow, Repeat, Shuffle } from "@mui/icons-material";
import SigmaFab from "../../custom/elements/SigmaFab";
import AudioCard from "../../custom/components/AudioCard";
import IRoom from "../../../api/models/room";
import { api } from "../../..";
import { hookstate, useHookstate } from "@hookstate/core";

let audio: any = undefined;
const playingDocIdState = hookstate('');
const audioLinkState = hookstate('');
const audioPlayingState = hookstate(false);

export default (props: { id: string, isOnTop: boolean, otherDocIds: Array<string>, room: IRoom, docId: string }) => {
  const close = () => SigmaRouter.back();
  let playingDocId = useHookstate(playingDocIdState);
  let link = useHookstate(audioLinkState);
  let playing = useHookstate(audioPlayingState);
  useEffect(() => {
    playingDocId.set(props.docId);
    
  }, [])
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Audio Player')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [props.isOnTop]);
  useEffect(() => {
    try {
      if (playing) {
        audio.play().catch((ex: any) => console.log(ex));
      } else {
        audio?.pause();
      }
    } catch (ex) { console.log(ex) }
  }, [playing]);
  useEffect(() => {
    try {
      audio?.pause();
    } catch (ex) { console.log(ex) }
    audio = new Audio(link.get({ noproxy: true }));
    try {
      audio?.play().catch((ex: any) => console.log(ex))
    } catch (ex) { console.log(ex) }
  }, [link]);
  useEffect(() => {
    if (playingDocId.get({ noproxy: true }).length > 0) {
      api.services.file.generateDownloadLink({ towerId: props.room.towerId, roomId: props.room.id, documentId: playingDocId.get({ noproxy: true }) }).then((l: string) => {
        link.set(l);
      });
    }
  }, [playingDocId]);
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
              props.otherDocIds.map(docId => {
                return (
                  <Grid item xs={1}>
                    <AudioCard docId={docId} room={props.room} playing={playingDocId.get({ noproxy: true }) === docId} onPlayPause={() => {
                      if (!playing.get({ noproxy: true })) {
                        playingDocId.set(docId);
                      } else {
                        playing.set(false);
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
          <Slider style={{ width: '100%' }} />
          <div style={{ width: '100%', display: 'flex' }}>
            <Typography>
              00:00
            </Typography>
            <div style={{ flex: 1 }} />
            <Typography>
              00:00
            </Typography>
          </div>
          <div style={{ margin: '24px 0px 5px 0px', display: 'flex', width: '100%', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton style={{ marginLeft: 16, marginRight: 8 }}>
              <Shuffle />
            </IconButton>
            <IconButton style={{ marginLeft: 8, marginRight: 8 }}>
              <FastRewind />
            </IconButton>
            <SigmaFab style={{ marginLeft: 8, marginRight: 8 }}>
              <PlayArrow />
            </SigmaFab>
            <IconButton style={{ marginLeft: 8, marginRight: 8 }}>
              <FastForward />
            </IconButton>
            <IconButton style={{ marginLeft: 8, marginRight: 16 }}>
              <Repeat />
            </IconButton>
          </div>
        </Paper>
      </div>
    </SliderPage>
  )
}
