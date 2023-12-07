import * as React from 'react';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IRoom from '../../../api/models/room';
import Image from './Image';
import { api } from '../../..';
import { Pause } from '@mui/icons-material';
import { themeColor, themeColorName } from '../../../App';

export default function AudioCard(props: { room: IRoom, docId: string, playing: boolean, onPlayPause: () => void }) {
  const [doc, setDoc]: [any, any] = React.useState();
  React.useEffect(() => {
    api.services.file.getDocuemnt({ towerId: props.room.towerId, roomId: props.room.id, documentId: props.docId }).then(doc => {
      setDoc(doc)
    });
  }, [])
  return (
    <Card style={{ position: 'relative', borderRadius: 16, display: 'flex', marginLeft: 16, marginRight: 16, marginTop: 16 }} elevation={0}>
      <Image
        docId={props.docId}
        room={props.room}
        isPreview
        tag={`audio-player-${props.docId}`}
        style={{ width: '100%', height: 176, marginLeft: 'auto', marginRight: 0, objectFit: 'fill' }}
      />
      <IconButton style={{
        width: 64, height: 64, backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)', position: 'absolute', left: '50%',
        top: '50%', transform: 'translate(-50%, -50%)'
      }} onClick={() => props.onPlayPause()}>
        {
          props.playing ? (
            <Pause style={{ fill: themeColorName.get({ noproxy: true }) === 'night' ? '#fff' : '#000' }} />
          ) : (
            <PlayArrowIcon style={{ fill: themeColorName.get({ noproxy: true }) === 'night' ? '#fff' : '#000' }} />
          )
        }
      </IconButton>
      <Typography style={{
        position: 'absolute',
        bottom: 0,
        width: 'calc(100% - 16px)',
        textAlign: 'center',
        padding: 8,
        backgroundColor: themeColorName.get({ noproxy: true }) === 'night' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
        color: themeColorName.get({ noproxy: true }) === 'night' ? '#fff' : '#000',
        backdropFilter: 'blur(10px)',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}>
        {doc ? doc.metadata.title : ''}
      </Typography>
    </Card>
  );
}
