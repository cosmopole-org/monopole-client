
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { useHookstate } from '@hookstate/core';
import { api } from '../../..';
import ITower from '../../../api/models/tower';
import TowerPickerCard from '../../custom/components/TowerPickerCard';

const TowerPicker = (props: { id: string, isOnTop: boolean, onTowerSelect: (tower: ITower) => void, onTowerDeselect?: (tower: ITower) => void, keepOnSelect?: boolean, selectedTowerIds?: Array<string> }) => {
  const towers = useHookstate(api.memory.spaces).get({ noproxy: true })
  const myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })
  const [selections, setSelections] = useState(props.selectedTowerIds ? props.selectedTowerIds : [])
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
  const chats = useHookstate(api.memory.chats).get({ noproxy: true })
  let chastTowerIdsDict: { [id: string]: boolean } = {}
  Object.values(chats).forEach(c => { chastTowerIdsDict[c.towerId] = true; });
  return (
    <SliderPage id={props.id}>
      <div style={{
        paddingLeft: 16, paddingRight: 16,
        backgroundColor: themeColor.get({ noproxy: true })[50], position: 'relative', width: 'calc(100% - 32px)', height: '100%', zIndex: 2, transition: 'opacity .25s',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', height: 56 }} />
        {
          Object.values(towers).filter(tower => ((tower.secret?.ownerId === myHumanId) && !chastTowerIdsDict[tower.id])).map((tower: ITower) => (
            <TowerPickerCard
              key={`tower-picker-item-${tower.id}`}
              tower={tower}
              checked={selections.includes(tower.id)}
              onSelect={() => {
                if (!props.keepOnSelect) close()
                if (selections.includes(tower.id)) {
                  setSelections([...selections.filter(tid => tid !== tower.id)])
                  props.onTowerDeselect && props.onTowerDeselect(tower)
                } else {
                  setSelections([...selections, tower.id])
                  props.onTowerSelect(tower)
                }
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
