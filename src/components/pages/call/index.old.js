import {
  AllOut,
  ArrowBack,
  CallEnd,
  Videocam,
  Mic,
  Screenshot,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Dialog,
  Fab,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  Zoom,
} from "@mui/material";
import * as React from "react";
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { blue, green, purple, red, yellow } from "@mui/material/colors";
import PeopleIcon from '@mui/icons-material/People';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';




export default function Call() {

  const { sizeMode: screenSizeMode } = useSharedSizeMode();

  forceUpdate = useForceUpdate();
  return (
    <Dialog
      keepMounted
      open={open}
      fullScreen={screenSizeMode === Screen.SMALL}
      fullWidth
      onClose={() => setOpen(false)}
      PaperProps={{
        style: {
          width: '100%',
          maxWidth: 1100,
          height: `calc(100% - ${comsoToolbarHeight}px - ${screenSizeMode === Screen.SMALL ? 0 : 24}px)`,
          position: "relative",
          backgroundColor: 'transparent',
          borderRadius: screenSizeMode === Screen.SMALL ? 0 : 24,
          marginTop: comsoToolbarHeight + (screenSizeMode === Screen.SMALL ? 0 : 24)
        }
      }}
    >
      <div
        style={{
          width: "100%",
          height: 80,
          position: "absolute",
          display: 'flex',
          background: colors.activityAppbar,
          borderRadius: screenSizeMode === Screen.SMALL ? 0 : '24px 24px 0px 0px'
        }}
      >
        <Toolbar style={{ marginTop: -16 }}>
          <IconButton onClick={close}>
            <ArrowBack style={{ fill: colors.textPencil }} />
          </IconButton>
          <div
            style={{
              flex: 1
            }}
          >
            <Typography ref={titleRef} style={{ color: colors.textPencil }}>
              {
                (userRef.current !== undefined && userRef.current !== null) ?
                  (userRef.current.firstName + ' ' + userRef.current.lastName) :
                  spaceRef.current?.title
              }
            </Typography>
            <Typography variant={"caption"} style={{ color: colors.textPencil }}>{timer}</Typography>
          </div>
        </Toolbar>
      </div>
      <Paper
        elevation={4}
        style={{
          position: "relative",
          width: "100%",
          height: `calc(100% - 56px)`,
          marginTop: 56,
          borderRadius: screenSizeMode === Screen.SMALL ? '24px 24px 0px 0px' : 24,
          background: colors.activityBody
        }}
      >
        <video controls={false} id="me-video" style={{
          zIndex: 3,
          display: videoStreams[bigUserId] ? 'block' : 'none',
          width: screenSizeMode === Screen.SMALL ? '100%' : 200,
          height: screenSizeMode === Screen.SMALL ? '100%' : 200,
          objectFit: 'cover',
          borderRadius: screenSizeMode === Screen.SMALL ? '24px 24px 0px 0px' : 24,
          position: screenSizeMode === Screen.SMALL ? 'relative' : 'absolute',
          top: screenSizeMode === Screen.SMALL ? 0 : 24,
          right: screenSizeMode === Screen.SMALL ? 0 : 24,
          opacity: screenSizeMode === Screen.SMALL ? 1 : 0.75
        }}
          autoplay="true"
        ></video>
        {
          screenSizeMode === Screen.SMALL ? (
            <Paper id="me-screen-container" elevation={8} style={{
              zIndex: 4,
              borderRadius: 12, position: 'absolute',
              left: 16, bottom: 32 + 150 + 88, display: screenStreams[bigUserId] ? 'block' : 'none', width: 'calc(100% - 32px)', height: 250,
              background: 'transparent'
            }}>
              <video controls={false} id="me-screen" style={{ opacity: 0.75, borderRadius: 12, width: '100%', height: '100%', objectFit: 'fill' }} autoplay="true"></video>
              <Zoom in={screenStreams[bigUserId]}>
                <Fab
                  size="medium"
                  color={'primary'}
                  style={{
                    marginTop: -48 - 16,
                    float: 'right',
                    marginRight: 16
                  }}
                  onClick={() => {
                    if (screenStreams[bigUserId]) {
                      Bus.publish(uiEvents.CREATE_FLOATING_VIDEO, { stream: screenStreams[bigUserId], type: 'screen' });
                    }
                  }}
                >
                  <PictureInPictureIcon />
                </Fab>
              </Zoom>
            </Paper>
          ) : (
            <Paper id="me-screen-container" elevation={0} style={{
              zIndex: 2,
              borderRadius: 24, position: 'absolute', maxWidth: `${window.innerHeight * 1.25}px`,
              left: 16, bottom: 150 + 56 + 48, top: 16, display: screenStreams[bigUserId] ? 'block' : 'none', width: 'calc(100% - 32px)',
              background: 'transparent'
            }}>
              <video controls={false} id="me-screen" style={{ opacity: 1, borderRadius: 24, width: '100%', height: '100%', objectFit: 'fill' }} autoplay="true"></video>
              <Zoom in={screenStreams[bigUserId]}>
                <Fab
                  size="medium"
                  color={'primary'}
                  style={{
                    marginTop: -48 - 16,
                    float: 'right',
                    marginRight: 16
                  }}
                  onClick={() => {
                    if (screenStreams[bigUserId]) {
                      Bus.publish(uiEvents.CREATE_FLOATING_VIDEO, { stream: screenStreams[bigUserId], type: 'screen' });
                    }
                  }}
                >
                  <PictureInPictureIcon />
                </Fab>
              </Zoom>
            </Paper>
          )
        }
        <Paper
          style={{
            width: "100%",
            height: peopleMaximize ? 'calc(100% - 132px)' : (150 + 16 + 16),
            overflowX: "auto",
            position: "absolute",
            left: 0,
            bottom: 0,
            zIndex: 7,
            backgroundColor: colors.activityBodyEmptySpace,
            backdropFilter: colors.backdrop,
            zIndex: 10,
            transition: 'height 0.5s'
          }}
          elevation={6}
        >
          <div id="people" style={{
            width: 'calc(100% - 32px)', marginTop: peopleMaximize ? 48 : 16, marginLeft: 16,
            marginRight: 16, textAlign: 'center', display: 'flex', flexWrap: 'wrap'
          }}>
            {
              Object.keys(users).map(userId => {
                if (userId === 'undefined') {
                  return null;
                } else if (videoStreams[userId] && screenStreams[userId]) {
                  return (<PeerVideo id={userId} currentBigUserId={bigUserId} stream={videoStreams[userId]} />);
                } else if (videoStreams[userId] && !screenStreams[userId]) {
                  return (<PeerVideo id={userId} currentBigUserId={bigUserId} stream={videoStreams[userId]} />);
                } else if (!videoStreams[userId] && screenStreams[userId]) {
                  return (<PeerVideo id={userId} currentBigUserId={bigUserId} stream={screenStreams[userId]} />);
                } else if (!videoStreams[userId] && !screenStreams[userId]) {
                  return (<PeerEmpty id={userId} currentBigUserId={bigUserId} />);
                }
              })
            }
            {Object.keys(audioStreams).map(id =>
              <PeerAudio id={id} stream={audioStreams[id]} />
            )}
          </div>
        </Paper>
      </Paper>
      <Zoom in={!maximizeBtnHidden}>
        <Fab
          size="medium"
          style={{
            backdropFilter: colors.backdrop,
            position: "absolute",
            right: 24,
            bottom: peopleMaximize ? undefined : (150 + 16 + 16 - 24),
            top: peopleMaximize ? 108 : undefined,
          }}
          onClick={() => {
            setMaximizeBtnHidden(true);
            setTimeout(() => {
              setPeopleMaximize(!peopleMaximize);
            }, 150);
            setTimeout(() => {
              setMaximizeBtnHidden(false);
            }, 700);
          }}
          color={'primary'}
        >
          {peopleMaximize ? <CloseFullscreenIcon /> : <AllOut />}
        </Fab>
      </Zoom>
      <Zoom in={!maximizeBtnHidden}>
        <Fab
          size="medium"
          color={'primary'}
          style={{
            position: "absolute",
            left: 16,
            bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
            top: peopleMaximize ? 108 : undefined,
          }}
          onClick={() => toggleScreen()}
        >
          <Screenshot />
        </Fab>
      </Zoom>
      <Zoom in={!maximizeBtnHidden}>
        <Fab
          size="medium"
          color={'primary'}
          style={{
            position: "absolute",
            left: 16 + 48 + 8,
            bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
            top: peopleMaximize ? 108 : undefined,
          }}
          onClick={() => toggleVideo()}
        >
          <Videocam />
        </Fab>
      </Zoom>
      <Zoom in={!maximizeBtnHidden}>
        <Fab
          size="medium"
          color={'primary'}
          style={{
            position: "absolute",
            left: 16 + 48 + 8 + 48 + 8,
            bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
            top: peopleMaximize ? 108 : undefined,
          }}
          onClick={() => toggleAudio()}
        >
          <Mic />
        </Fab>
      </Zoom>
      <Zoom in={!maximizeBtnHidden}>
        <Fab
          size="medium"
          color={'secondary'}
          style={{
            position: "absolute",
            left: 16 + 48 + 8 + 48 + 8 + 48 + 8,
            bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
            top: peopleMaximize ? 108 : undefined,
          }}
          onClick={() => {
            exit();
            spaceRef.current = undefined;
            setTimer('00:00');
            spaceRef.current = undefined;
            userRef.current = undefined;
            extOpen = false;
            setOpen(false);
          }}
        >
          <CallEnd />
        </Fab>
      </Zoom>
      <Zoom in={!maximizeBtnHidden}>
        <Fab
          size="medium"
          color={'primary'}
          style={{
            position: "absolute",
            left: 16 + 48 + 8 + 48 + 8 + 48 + 8 + 8 + 48,
            bottom: peopleMaximize ? undefined : (150 + 16 + 16 + 16),
            top: peopleMaximize ? 108 : undefined,
          }}
          onClick={() => {
            Bus.publish(uiEvents.OPEN_DRAWER_MENU, {
              view: <PeopleMenu videoPeers={users} />,
              openDrawer: true
            });
          }}
        >
          <PeopleIcon />
        </Fab>
      </Zoom>
      <Zoom in={!peopleMaximize && videoStreams[bigUserId]}>
        <Fab
          size="medium"
          color={'primary'}
          style={{
            position: "absolute",
            right: 24,
            top: 56 + 24 + comsoToolbarHeight,
          }}
          onClick={() => {
            if (videoStreams[bigUserId]) {
              Bus.publish(uiEvents.CREATE_FLOATING_VIDEO, { stream: videoStreams[bigUserId], type: 'video' });
            }
          }}
        >
          <PictureInPictureIcon />
        </Fab>
      </Zoom>
    </Dialog>
  );
}
