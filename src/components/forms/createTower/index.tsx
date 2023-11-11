import { blue } from '@mui/material/colors';
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useEffect, useRef, useState } from 'react';
import { SigmaRouter } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Done, Edit } from '@mui/icons-material';
import SigmaFab from '../../custom/elements/SigmaFab';
import SigmaTextField from '../../custom/elements/SigmaTextField';
import { api } from '../../..';
import { Avatar, Card, IconButton, Typography } from '@mui/material';
import SigmaSwitch from '../../custom/elements/SigmaSwitch';

const CreateTower = (props: { id: string, isOnTop: boolean, tower?: any }) => {
  console.log(
    props.tower
  )
  const isEditing = (props.tower !== undefined)
  const [publicMode, setPublicMode] = useState(isEditing ? props.tower.isPublic : false)
  const [title, setTitle] = useState(isEditing ? props.tower.title : '')
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle(isEditing ? 'Edit Tower' : 'Create Tower')
      switchColor && switchColor(blue[500], StatusThemes.DARK)
    }
  }, [])
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', zIndex: 2, transition: 'opacity .25s', backgroundColor: blue[50], padding: 16
      }}>
        <SigmaTextField
          label={'Title'}
          value={title}
          style={{ marginTop: statusbarHeight() + 24, width: '100%' }}
          onChange={e => setTitle(e.target.value)}
        />
        <Card elevation={0} style={{
          paddingLeft: 16, paddingRight: 16, backgroundColor: blue[100], borderRadius: 24, height: 'auto', display: 'flex',
          width: 'calc(100% - 32px)', position: 'relative', marginTop: 16, paddingTop: 8, paddingBottom: 8
        }}>
          <Typography style={{ flex: 1, marginTop: 8 }}>
            public
          </Typography>
          <SigmaSwitch checked={publicMode} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPublicMode(event.target.checked);
          }} />
        </Card>
        <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }}
          onClick={() => {
            if (title.length > 0) {
              if (isEditing) {
                api.services.tower.update({ title, towerId: props.tower.id, isPublic: publicMode }).then(() => {
                  SigmaRouter.back()
                }).catch(ex => {
                  console.log(ex)
                })
              } else {
                api.services.tower.create({ title, isPublic: publicMode }).then(() => {
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

export default CreateTower
