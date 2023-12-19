
import { useEffect, useRef } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import '../../../resources/styles/voicerecorder.css';
import { Button, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

export default function VoiceRecorder(props: { onVoiceRecorded: any, onCancel?: any }) {
    const recorderControls = useAudioRecorder()
    const shouldSendRef = useRef(true);
    useEffect(() => {
        recorderControls.startRecording()
    }, [])
    return (
        <div>
            <AudioRecorder
                onRecordingComplete={(blob) => {
                    if (shouldSendRef.current) {
                        props.onVoiceRecorded(blob);
                    } else {
                        props.onCancel && props.onCancel()
                    }
                }}
                recorderControls={recorderControls}
                showVisualizer
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                classes={{
                    AudioRecorderClass: 'voice-recorder'
                }}
            />
            <IconButton style={{position: 'absolute', left: 8, top: 16}} onClick={() => {
                shouldSendRef.current = false;
                recorderControls.stopRecording();
            }}>
                <Delete />
            </IconButton>
        </div >
    )
}
