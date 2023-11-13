import { blue } from '@mui/material/colors';
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useEffect, useRef } from 'react';
import { SigmaRouter } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Done } from '@mui/icons-material';
import SigmaFab from '../../custom/elements/SigmaFab';
import SigmaTextField from '../../custom/elements/SigmaTextField';
import { api } from '../../..';

const CreateMachine = (props: { id: string, isOnTop: boolean, machine?: any }) => {
  const isEditing = (props.machine !== undefined)
  const titleRef = useRef(isEditing ? props.machine.title : '')
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle(isEditing ? 'Edit Machine' : 'Create Machine')
      switchColor && switchColor(blue[500], StatusThemes.DARK)
    }
  }, [])
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', zIndex: 2, transition: 'opacity .25s', backgroundColor: blue[50], padding: 16
      }}>
        <SigmaTextField
          defaultValue={titleRef.current}
          label={'Title'}
          style={{ marginTop: statusbarHeight() + 24, width: '100%' }}
          onChange={e => { titleRef.current = e.target.value }}
        />
        <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }}
          onClick={() => {
            let title = titleRef.current
            if (title.length > 0) {
              if (isEditing) {
                api.services.machine.update({ machineId: props.machine.id, name: title }).then(() => {
                  SigmaRouter.back()
                }).catch(ex => {
                  console.log(ex)
                })
              } else {
                api.services.machine.create({ name: title }).then(() => {
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

export default CreateMachine
