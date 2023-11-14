
import './index.css';
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from '../../sections/StatusBar';
import { useEffect, useRef } from 'react';
import { SigmaRouter, themeColor } from '../../../App';
import SliderPage from '../../layouts/SliderPage';
import { Done } from '@mui/icons-material';
import SigmaFab from '../../custom/elements/SigmaFab';
import SigmaTextField from '../../custom/elements/SigmaTextField';
import { api } from '../../..';

const UpdateProfile = (props: { id: string, isOnTop: boolean }) => {
  let me = api.memory.humans.get({ noproxy: true })[api.memory.myHumanId.get({ noproxy: true })]
  const firstNameRef = useRef(me.firstName)
  const lastNameRef = useRef(me.lastName ? me.lastName : '')
  useEffect(() => {
    if (props.isOnTop) {
      switchLeftControl && switchLeftControl(LeftControlTypes.BACK, () => SigmaRouter.back())
      switchRightControl && switchRightControl(RightControlTypes.NONE)
      switchTitle && switchTitle('Edit My Profile')
      switchColor && switchColor(themeColor.get({noproxy: true})[300], StatusThemes.DARK)
    }
  }, [])
  return (
    <SliderPage id={props.id}>
      <div style={{
        position: 'relative', width: 'calc(100% - 32px)', height: 'calc(100% - 32px)', zIndex: 2, transition: 'opacity .25s', backgroundColor: themeColor.get({noproxy: true})[50], padding: 16
      }}>
        <SigmaTextField
          defaultValue={firstNameRef.current}
          label={'Firstname'}
          style={{ marginTop: statusbarHeight() + 24, width: '100%' }}
          onChange={e => { firstNameRef.current = e.target.value }}
        />
        <SigmaTextField
          defaultValue={lastNameRef.current}
          label={'Lastname'}
          style={{ marginTop: 16, width: '100%' }}
          onChange={e => { lastNameRef.current = e.target.value }}
        />

        <SigmaFab style={{ position: 'absolute', right: 16, bottom: 16 }}
          onClick={() => {
            let firstName = firstNameRef.current
            let lastName = lastNameRef.current
            if (firstName.length > 0) {
              api.services.human.update({ firstName, lastName }).then(() => {
                SigmaRouter.back()
              }).catch(ex => {
                console.log(ex)
              })
            }
          }}>
          <Done />
        </SigmaFab>
      </div>
    </SliderPage>
  )
}

export default UpdateProfile
