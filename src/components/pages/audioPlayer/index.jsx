
import React from 'react';
import './index.scss';
import SigmaFab from '../../custom/elements/SigmaFab';
import { ArrowBackIos, ArrowDownward, FastForward, FastRewind, Forward, Pause, PlayArrow, Repeat, Shuffle, TurnedIn } from '@mui/icons-material';
import { IconButton, Paper, SwipeableDrawer, Typography } from '@mui/material';
import SliderPage from '../../layouts/SliderPage';
import { SigmaRouter, themeColor } from '../../../App';
import SigmaAvatar from '../../custom/elements/SigmaAvatar';
import { LeftControlTypes, RightControlTypes, StatusThemes, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';

const songList = [
  { name: 'Sanctified with Dynamite', author: 'PowerWolf', duration: '3:51', cover: 'https://cdnb.artstation.com/p/assets/images/images/010/532/065/large/zsofia-dankova-1.jpg?1539776234' },
  { name: 'Army of the Night', author: 'PowerWolf', duration: '3:51', cover: 'https://i.pinimg.com/originals/10/37/36/1037361b721513a7168e1dae07139f55.jpg' },
  { name: 'Higher Than Heaven', author: 'PowerWolf', duration: '3:51', cover: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b81633f7-ac45-4e1d-9255-46297d588240/dcf39re-204aaff0-a53f-4f9b-83d3-81239bf35778.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I4MTYzM2Y3LWFjNDUtNGUxZC05MjU1LTQ2Mjk3ZDU4ODI0MFwvZGNmMzlyZS0yMDRhYWZmMC1hNTNmLTRmOWItODNkMy04MTIzOWJmMzU3NzgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.fE1cp7I7GjauqJ8gKCoqz2cK1BHjeAwhivRnE7oMsVo' },
  { name: 'Incense & Iron', author: 'PowerWolf', duration: '3:51', cover: 'https://i.pinimg.com/originals/2b/ca/63/2bca632180d842a6f15908154ce862bb.jpg' },
  { name: 'Venom of Venus', author: 'PowerWolf', duration: '3:51', cover: 'https://steamuserimages-a.akamaihd.net/ugc/941709259346307842/830C554F58DDEF61ACD21D28FBC3FC4FEAAAE136/' },
  { name: 'Sanctified with Dynamite', author: 'PowerWolf', duration: '3:51', cover: 'https://cdnb.artstation.com/p/assets/images/images/010/532/065/large/zsofia-dankova-1.jpg?1539776234' },
  { name: 'Army of the Night', author: 'PowerWolf', duration: '3:51', cover: 'https://i.pinimg.com/originals/10/37/36/1037361b721513a7168e1dae07139f55.jpg' },
  { name: 'Higher Than Heaven', author: 'PowerWolf', duration: '3:51', cover: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b81633f7-ac45-4e1d-9255-46297d588240/dcf39re-204aaff0-a53f-4f9b-83d3-81239bf35778.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I4MTYzM2Y3LWFjNDUtNGUxZC05MjU1LTQ2Mjk3ZDU4ODI0MFwvZGNmMzlyZS0yMDRhYWZmMC1hNTNmLTRmOWItODNkMy04MTIzOWJmMzU3NzgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.fE1cp7I7GjauqJ8gKCoqz2cK1BHjeAwhivRnE7oMsVo' },
  { name: 'Incense & Iron', author: 'PowerWolf', duration: '3:51', cover: 'https://i.pinimg.com/originals/2b/ca/63/2bca632180d842a6f15908154ce862bb.jpg' },
  { name: 'Venom of Venus', author: 'PowerWolf', duration: '3:51', cover: 'https://steamuserimages-a.akamaihd.net/ugc/941709259346307842/830C554F58DDEF61ACD21D28FBC3FC4FEAAAE136/' },
]

const SongList = ({ list = [], stop, handle, active, open }) => (
  <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}>
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <img style={{ width: '100%', height: 256 }} src={list[4].cover} />
      <Paper style={{ borderRadius: '24px 24px 0px 0px', position: 'relative', zIndex: 2, marginTop: -32, paddingTop: 8 }}>
        {list.map((el, index) => (
          <Paper elevation={0} style={{ display: 'flex', marginLeft: 8, marginTop: 8, padding: 16, width: 'calc(100% - 48px)', borderRadius: 16, height: 64, backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <SigmaAvatar src={el.cover} style={{ width: 64, height: 64, borderRadius: 16 }}>
              <img src={el.cover} />
            </SigmaAvatar>
            <div style={{ marginLeft: 16, flex: 1 }}>
              <Typography variant='h6'>
                Hello
              </Typography>
              <Typography variant='body1'>
                02:35
              </Typography>
            </div>
            <IconButton>
              <PlayArrow />
            </IconButton>
          </Paper>
        ))}
      </Paper>
    </div>
  </div>
)

const SongPage = ({ index, stop, next, prev, open, handleOpen, pause }) => {
  const data = songList[index];
  return (
    <SwipeableDrawer open={open} anchor='bottom' PaperProps={{
      style: {
        width: '100%',
        height: 500
      }
    }}>
      <SigmaFab className='backward' onClick={handleOpen}>
        <ArrowBackIos style={{ transform: 'rotate(90deg)' }} />
      </SigmaFab>
      <div className='song__cover-wrapper'>
        <div class="song__cover">
          <img src={data.cover} alt="" />
        </div>
        {open &&
          <div className='song__actions'>
            <SigmaFab className='song__btn'>
              <Shuffle />
            </SigmaFab>
            <SigmaFab className='song__btn'>
              <Repeat />
            </SigmaFab>
          </div>
        }
      </div>
      <div class="song__info">
        <span class="song__name" onClick={!open ? handleOpen : undefined}>
          <span>{data.name}</span>
          <span class="song__author">{data.author}</span>
        </span>
        <div class="song__panel">
          {open && <SigmaFab disabled={!prev} onClick={prev}>
            <FastRewind />
          </SigmaFab>}
          <SigmaFab onClick={() => stop(index)}>
            {pause ? <PlayArrow /> : <Pause />}
          </SigmaFab>
          <SigmaFab disabled={!next} onClick={next}>
            <FastForward />
          </SigmaFab>
        </div>
      </div>
    </SwipeableDrawer>
  )
};

class AudioPlayer extends React.Component {
  state = {
    open: false,
    active: false,
    pause: false
  };

  handleOpen = () => { this.setState(state => ({ open: !state.open })) };
  pause = () => { this.setState(state => ({ pause: !state.pause })) }
  handlePlay = (active) => {
    this.setState(state => ({
      active: state.active === active ? false : active
    }))
  };
  next = () => this.handlePlay(this.state.active < songList.length - 1 ? this.state.active + 1 : 0);
  prev = () => this.handlePlay(this.state.active > 0 ? this.state.active - 1 : songList.length - 1);

  close = () => SigmaRouter.back()

  componentDidUpdate() {
    if (this.props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, this.close)
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Audio Player')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }

  render() {
    const { active, open, pause } = this.state;
    return (
      <SliderPage id={this.props.id}>
        <SongList
          list={songList}
          stop={this.handlePlay}
          open={open}
          handle={this.handlePlay}
          active={active}
        />
        {(active || active === 0) &&
          <SongPage
            open={open}
            index={active}
            handleOpen={this.handleOpen}
            pause={pause}
            stop={this.pause}
            next={this.next}
            prev={this.prev} />
        }
      </SliderPage>
    )
  }
};

export default AudioPlayer
