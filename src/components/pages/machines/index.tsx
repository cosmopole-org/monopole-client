
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Inventory, Subscriptions } from '@mui/icons-material';
import { SigmaTab, SigmaTabs } from '../../custom/elements/SigmaTabs';
import Inventions from '../../tabs/Inventions';

const Machines = (props: { id: string, isOnTop: boolean }) => {
  const [activeTab, setActiveTab] = useState('inventions')
  const close = () => {
    SigmaRouter.back()
  }
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Machines')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [props.isOnTop])
  return (
    <SliderPage id={props.id}>
      <div style={{
        backgroundColor: themeColor.get({ noproxy: true })[50], position: 'relative', width: '100%', height: '100%', zIndex: 2, transition: 'opacity .25s',
      }}>
        <div style={{ width: '100%', height: `calc(100% - ${statusbarHeight() + 16}px)`, paddingTop: statusbarHeight() + 16 }}>
          <Inventions show={activeTab === 'inventions'} />
          <Inventions show={activeTab === 'subscriptions'} />
        </div>
        <Paper
          style={{
            borderRadius: 0, width: '100%', height: 'auto', paddingTop: statusbarHeight() + 16, position: 'absolute', left: 0, top: 0
          }}
        >
          <SigmaTabs
            onChange={(e, newValue) => {
              setActiveTab(newValue)
            }}
            value={activeTab}
          >
            <SigmaTab icon={<><Inventory /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Inventions</Typography></>} value={'inventions'} />
            <SigmaTab icon={<><Subscriptions /><Typography variant={'body2'} style={{ marginLeft: 4, marginTop: 2 }}>Subscriptions</Typography></>} value={'subscriptions'} />
          </SigmaTabs>
        </Paper>
      </div>
    </SliderPage >
  )
}

export default Machines
