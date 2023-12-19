
import { useEffect } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import '../../../resources/styles/voicerecorder.css';

export default function VoiceRecorder(props: { onVoiceRecorded: any }) {
    const recorderControls = useAudioRecorder()
    useEffect(() => {
        recorderControls.startRecording()
    }, [])
    return (
        <div>
            <AudioRecorder
                onRecordingComplete={(blob) => props.onVoiceRecorded(blob)}
                recorderControls={recorderControls}
                showVisualizer
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                }}
                classes={{
                    AudioRecorderClass: 'voice-recorder'
                }}
                downloadFileExtension='mp3'
            />
        </div>
    )
}
