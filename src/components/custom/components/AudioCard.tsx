import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { themeColor } from '../../../App';
import { Paper } from '@mui/material';
import IRoom from '../../../api/models/room';
import Image from './Image';
import { api } from '../../..';
import { PauseSharp } from '@mui/icons-material';

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
        width: 64, height: 64, backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)', position: 'absolute', left: '50%',
        top: '50%', transform: 'translate(-50%, -50%)'
      }} onClick={() => props.onPlayPause()}>
        {
          props.playing ? (
            <PauseSharp style={{ fill: '#000' }} />
          ) : (
            <PlayArrowIcon style={{ fill: '#000' }} />
          )
        }
      </IconButton>
      <Typography style={{
        position: 'absolute',
        bottom: 0,
        width: 'calc(100% - 16px)',
        textAlign: 'center',
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: '#000',
        backdropFilter: 'blur(10px)',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }}>
        {doc ? doc.metadata.title : ''}
      </Typography>
    </Card>
  );
}
