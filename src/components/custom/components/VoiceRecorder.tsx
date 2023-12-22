
import { useEffect, useRef } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import '../../../resources/styles/voicerecorder.css';
import { IconButton } from '@mui/material';
import {  Delete } from '@mui/icons-material';

export default function VoiceRecorder(props: { onVoiceRecorded: any, onCancel?: any, style?: any, closed?: boolean }) {
    const recorderControls = useAudioRecorder()
    const shouldSendRef = useRef(true);
    useEffect(() => {
        recorderControls.startRecording()
    }, [])
    useEffect(() => {
        if (props.closed) {
            shouldSendRef.current = false;
            recorderControls.stopRecording();
        }
    }, [props.closed])
    return (
        <div style={{ position: 'relative', display: 'flex', paddingTop: 16 }}>
            <IconButton onClick={() => {
                shouldSendRef.current = false;
                recorderControls.stopRecording();
            }}>
                <Delete />
            </IconButton>
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
        </div >
    )
}
