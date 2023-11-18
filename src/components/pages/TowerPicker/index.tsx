
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import HumanTag from '../../custom/components/HumanTag';
import { useHookstate } from '@hookstate/core';
import { api } from '../../..';
import ITower from '../../../api/models/tower';
import TowerCard from '../../custom/components/TowerCard';
import TowerPickerCard from '../../custom/components/TowerPickerCard';

const TowerPicker = (props: { id: string, isOnTop: boolean, onTowerSelect: (tower: ITower) => void }) => {
  const towers = useHookstate(api.memory.spaces).get({ noproxy: true })
  const myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })
  const close = () => {
    SigmaRouter.back()
  }
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Invite to ...')
      switchColor && switchColor(themeColor.get({ noproxy: true })[500], StatusThemes.DARK)
    }
  }, [props.isOnTop])
  console.log(towers)
  return (
    <SliderPage id={props.id}>
      <div style={{
        paddingLeft: 16, paddingRight: 16,
        backgroundColor: themeColor.get({ noproxy: true })[50], position: 'relative', width: 'calc(100% - 32px)', height: '100%', zIndex: 2, transition: 'opacity .25s',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', height: 56 }} />
        {
          Object.values(towers).filter(tower => tower.secret?.ownerId === myHumanId).map((tower: ITower) => (
            <TowerPickerCard
              key={`tower-picker-item-${tower.id}`}
              tower={tower}
              onSelect={() => {
                close()
                props.onTowerSelect(tower)
              }}
              style={{ marginTop: 16 }}
            />
          ))
        }
      </div>
    </SliderPage >
  )
}

export default TowerPicker
