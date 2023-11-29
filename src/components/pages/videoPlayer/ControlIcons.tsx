import React from 'react';
import './ControlIcons.css';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { ArrowBack, FastRewind } from '@mui/icons-material';
import { FastForwardSharp } from '@mui/icons-material';
import { PlayArrowSharp } from '@mui/icons-material';
import { PauseSharp } from '@mui/icons-material';
import { VolumeUp } from '@mui/icons-material';
import { VolumeOff } from '@mui/icons-material';
import { Fullscreen } from '@mui/icons-material';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { useEffect } from 'react';

let controlsHiderTimeout: any;

const ControlIcons = (props: { closePlayer: any, playandpause: any, playing: boolean, rewind: any, fastForward: any, muting: any, muted: any, volumeChange: any, volumeSeek: any, volume: any, playRate: any, playerbackRate: any, fullScreenMode: any, onSeek: any, played: any, onSeekMouseUp: any, onSeekMouseDown: any, fullMovieTime: any, playedTime: any }) => {

  let { closePlayer, playandpause, playing, rewind, fastForward, muting, muted, volumeChange, volumeSeek, volume, playRate, playerbackRate, fullScreenMode, onSeek, played, onSeekMouseUp, onSeekMouseDown, fullMovieTime, playedTime } = props

  const [show, setShow] = React.useState(false);

  const resetHiderTimer = (reInit: any) => {
    if (controlsHiderTimeout) {
      clearTimeout(controlsHiderTimeout);
      controlsHiderTimeout = undefined;
    }
    if (reInit) {
      controlsHiderTimeout = setTimeout(() => {
        controlsHiderTimeout = undefined;
        setShow(false);
      }, 2500);
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopOver = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setShow(true);
    controlsHiderTimeout = setTimeout(() => {
      controlsHiderTimeout = undefined;
      setShow(false);
    }, 2500);
    return () => {
      resetHiderTimer(false);
    };
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'playbackrate-popover' : undefined;

  function ValueLabelComponent(props: any) {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  const PrettoSlider = styled(Slider)({
    height: 5,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 16,
      width: 16,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&:before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#52af77',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&:before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
  });
  return (
    <div className="controls__div" style={{ opacity: show ? 1 : 0, transition: 'opacity 0.5s' }} onClick={() => {
      if (show) {
        resetHiderTimer(false);
        setShow(false);
      } else {
        setShow(true);
        resetHiderTimer(true);
      }
    }}>
      <div style={{ width: '100%', height: '100%', visibility: show ? 'visible' : 'hidden' }}>
        <Grid container direction='row' alignItems='center' justifyContent='center'
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
          <IconButton className='controls__icons' aria-label='reqind' onClick={e => { e.stopPropagation(); resetHiderTimer(true); rewind(); }}>
            <FastRewind fontSize='large' style={{ color: 'white' }} />
          </IconButton>
          <IconButton className='controls__icons' aria-label='reqind' onClick={e => { e.stopPropagation(); resetHiderTimer(true); playandpause(); }}>
            {
              playing ? (
                <PauseSharp fontSize='large' style={{ color: 'white' }} />
              ) : (
                <PlayArrowSharp fontSize='large' style={{ color: 'white' }} />
              )
            }
          </IconButton>
          <IconButton className='controls__icons' aria-label='reqind' onClick={e => { e.stopPropagation(); resetHiderTimer(true); fastForward(); }}>
            <FastForwardSharp fontSize='large' style={{ color: 'white' }} />
          </IconButton>
        </Grid>
        <Grid container direction='row' alignItems='center' justifyContent='space-between' style={{ padding: 16, position: 'fixed', bottom: 0 }}
          onClick={e => { e.stopPropagation(); resetHiderTimer(true); }}>
          <Grid item>
            <Typography variant='h5' style={{ color: 'white' }}></Typography>
          </Grid>

          <Grid item xs={12}>
            <PrettoSlider
              min={0}
              max={100}
              value={played * 100}
              onChange={(e, newValue, activeThumb) => { resetHiderTimer(true); onSeek(e, newValue, activeThumb); }}
              onMouseDown={onSeekMouseDown}
              onChangeCommitted={onSeekMouseUp}
              valueLabelDisplay="auto"
              // aria-label="custom thumb label"
              components={{
                ValueLabel: ValueLabelComponent,
              }}
            />
            <Grid container direction='row' justifyContent='space-between'>
              <Typography variant='h6' style={{ color: 'white' }}>{playedTime}</Typography>
              <Typography variant='h6' style={{ color: 'white' }}>{fullMovieTime}</Typography>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container alignItems='center' direction='row'>
              <IconButton className='controls__icons' aria-label='reqind' onClick={playandpause}>
                {
                  playing ? (
                    <PauseSharp fontSize='large' style={{ color: 'white' }} />
                  ) : (
                    <PlayArrowSharp fontSize='large' style={{ color: 'white' }} />
                  )
                }
              </IconButton>

              <IconButton className='controls__icons' aria-label='reqind' onClick={muting}>
                {
                  muted ? (
                    <VolumeOff fontSize='large' style={{ color: 'white' }} />
                  ) : (
                    <VolumeUp fontSize='large' style={{ color: 'white' }} />
                  )
                }
              </IconButton>

              <Typography style={{ color: '#fff', paddingTop: '5px' }}>{volume * 100}</Typography>
              <Slider
                min={0}
                max={100}
                value={volume * 100}
                onChange={(e, newValue, activeThumb) => { resetHiderTimer(true); volumeChange(e, newValue, activeThumb); }}
                onChangeCommitted={volumeSeek}
                className='volume__slider'
              />
            </Grid>
          </Grid>

          <Grid item>
            <Button variant='text' onClick={handlePopOver} className='bottom__icons'>
              <Typography>{playerbackRate}X</Typography>
            </Button>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
            >
              <Grid container direction='column-reverse'>
                {
                  [0.5, 1, 1.5, 2].map((rate) => (
                    <Button variant='text' onClick={() => playRate(rate)}>
                      <Typography color={rate === playerbackRate ? 'secondary' : 'default'}>{rate}</Typography>
                    </Button>
                  ))
                }
              </Grid>

            </Popover>

            <IconButton className='bottom__icons' onClick={fullScreenMode}>
              <Fullscreen fontSize='large' style={{ fill: '#fff' }} />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    </div >
  )
}

export default ControlIcons;
