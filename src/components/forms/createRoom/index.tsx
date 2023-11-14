
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useEffect, useRef } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Done } from '@mui/icons-material';
import SigmaFab from '../../custom/elements/SigmaFab';
import SigmaTextField from '../../custom/elements/SigmaTextField';
import { api } from '../../..';

const CreateRoom = (props: { id: string, isOnTop: boolean, towerId: any, room?: any }) => {
  const isEditing = (props.room !== undefined)
  const titleRef = useRef('')
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle(isEditing ? 'Edit Room' : 'Create Room')
      switchColor && switchColor(themeColor.get({noproxy: true})[300], StatusThemes.DARK)
    }
  }, [])
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', zIndex: 2, transition: 'opacity .25s', backgroundColor: themeColor.get({noproxy: true})[50], padding: 16
      }}>
        <SigmaTextField
          defaultValue={isEditing ? props.room.title : ''}
          label={'Title'}
          style={{ marginTop: statusbarHeight() + 24, width: '100%' }}
          onChange={e => { titleRef.current = e.target.value }}
        />
        <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }}
          onClick={() => {
            let title = titleRef.current
            if (title.length > 0) {
              if (isEditing) {
                api.services.room.update({ title, towerId: props.towerId, roomId: props.room.id }).then(() => {
                  SigmaRouter.back()
                }).catch(ex => {
                  console.log(ex)
                })
              } else {
                api.services.room.create({ title, towerId: props.towerId }).then(() => {
                  SigmaRouter.back()
                }).catch(ex => {
                  console.log(ex)
                })
              }
            }
          }}>
          <Done />
        </SigmaFab>
      </div>
    </SliderPage>
  )
}

export default CreateRoom
