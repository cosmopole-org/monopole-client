import { Box, Card, Grid, Paper, Typography } from "@mui/material"
import { themeColor } from "../../../App"
import { LeftControlTypes, RightControlTypes, StatusThemes, statusbarHeight, switchColor, switchLeftControl, switchRightControl, switchTitle } from "../../sections/StatusBar"
import React, { useEffect, useRef, useState } from "react";
import { Peer } from "peerjs";
import { State, hookstate, useHookstate } from "@hookstate/core";
import { api } from "../../..";
import config from "../../../config";
import SigmaAvatar from "../../custom/elements/SigmaAvatar";
import IHuman from "../../../api/models/human";
import IRoom from "../../../api/models/room";
import SigmaFab from "../../custom/elements/SigmaFab";
import { Camera, Mic, ScreenShare, Videocam } from "@mui/icons-material";

let navigator = window.navigator as any

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

let peer: Peer;

var ICE_SERVERS = [
    {
        url: 'stun:164.92.234.28:3478'
    },
    {
        url: 'turn:164.92.234.28:3478',
        username: 'guest',
        credential: 'somepassword',
    }
]

let connections: { [id: string]: any } = {};
let videoInCalls: { [id: string]: any } = {};
let screenInCalls: { [id: string]: any } = {};
let audioInCalls: { [id: string]: any } = {};
let videoOutCalls: { [id: string]: any } = {};
let screenOutCalls: { [id: string]: any } = {};
let audioOutCalls: { [id: string]: any } = {};
let videoStreams: { [id: string]: any } = {};
let screenStreams: { [id: string]: any } = {};
let audioStreams: { [id: string]: any } = {};
let myVideoStream: any = undefined;
let myScreenStream: any = undefined;
let myAudioStream: any = undefined;
let startTime: any = undefined;
let extOpen = false;
let timerInterval: any = undefined;
let once = false;
let users: { [id: string]: any } = {}
let videoOn = false
let audioOn = false
let screenOn = false
let bigUserId = undefined

function millisToMinutesAndSeconds(millis: number) {
    var minutes = Math.floor(millis / 60000);
    var seconds = Math.floor((millis % 60000) / 1000);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export let viewCallPage = (room: IRoom) => { }

const updaters: { [id: string]: State<any> } = {}

const Block = (props: { userId: string }) => {
    const updater = useHookstate(updaters[props.userId]).get({ noproxy: true })
    let videoStream = videoStreams[props.userId]
    const videoRef = useRef(null)
    useEffect(() => {
        if (videoRef.current) {
            (videoRef.current as HTMLVideoElement).srcObject = videoStream
        }
    }, [updater])
    return (
        <video autoPlay ref={videoRef} style={{ width: '100%', height: '100%' }} />
    )
}

const Call = (props: { id: string, isOnTop: boolean, human: IHuman, room: IRoom }) => {

    const triggerBlock = (userId: string) => updaters[userId].set(Math.random())

    const [_, setTrigger] = useState(Math.random())
    const forceUpdate = () => setTrigger(Math.random())

    const myHumanId = useHookstate(api.memory.myHumanId).get({ noproxy: true })

    const spaceRef: any = React.useRef();
    const userRef: any = React.useRef();
    const [timer, setTimer] = React.useState('00:00');
    const [open, setOpen] = React.useState(false);
    const [maximizeBtnHidden, setMaximizeBtnHidden] = React.useState(false);
    const [peopleMaximize, setPeopleMaximize] = React.useState(false);
    const titleRef = React.useRef(undefined);
    const loadedRef = React.useRef(false);

    const close = () => {
        extOpen = false;
        setOpen(false);
    }

    useEffect(() => {
        if (props.isOnTop) {
            switchLeftControl && switchLeftControl(LeftControlTypes.BACK, close)
            switchRightControl && switchRightControl(RightControlTypes.NONE)
            switchTitle && switchTitle('Call')
        }
    }, [props.isOnTop]);

    const exit = () => {
        api.services.call.leaveCall();
        clearInterval(timerInterval);
        Object.values(videoInCalls).forEach((call: any) => {
            call.close();
        });
        Object.values(screenInCalls).forEach((call: any) => {
            call.close();
        });
        Object.values(audioInCalls).forEach((call: any) => {
            call.close();
        });
        Object.values(videoOutCalls).forEach((call: any) => {
            call.close();
        });
        Object.values(screenOutCalls).forEach((call: any) => {
            call.close();
        });
        Object.values(audioOutCalls).forEach((call: any) => {
            call.close();
        });
        Object.values(connections).forEach((connection: any) => {
            connection.close();
        });
        users = {}
        connections = {};
        videoInCalls = {};
        screenInCalls = {};
        audioInCalls = {};
        videoOutCalls = {};
        screenOutCalls = {};
        audioOutCalls = {};
        endVideo();
        endScreen();
        endAudio();
        videoOn = false
        audioOn = false
        screenOn = false
        myVideoStream = undefined; myScreenStream = undefined; myAudioStream = undefined;
        videoStreams = {}; screenStreams = {}; audioStreams = {};
        //Bus.publish(uiEvents.STOP_ALL_FLOATING_VIDEOS, {});
    };

    const startVideo = () => {
        navigator.getUserMedia(
            {
                video: {
                    width: 300,
                    height: 300
                }
            },
            function (stream: any) {
                console.log('Access granted to video/video');
                myVideoStream = stream;
                videoStreams[myHumanId] = stream;
                videoOn = true;
                let meVideo = document.getElementById('me-video')
                if (meVideo) (meVideo as HTMLVideoElement).srcObject = myVideoStream;
                Object.values(connections).forEach(conn => {
                    if (conn) {
                        callWithVideoStream(conn.peer);
                    }
                });
                triggerBlock(myHumanId)
            },
            function () {
                console.log('Access denied for video/video')
                alert(
                    'You chose not to provide access to the camera/microphone.',
                )
            },
        );
    }

    const endVideo = () => {
        if (myVideoStream !== undefined) {
            myVideoStream.getTracks().forEach((track: any) => {
                track.stop();
            });
        }
        videoOn = false;
        delete videoStreams[myHumanId];
        let meVideo = document.getElementById('me-video')
        if (meVideo) (meVideo as HTMLVideoElement).srcObject = null;
        triggerBlock(myHumanId)
        api.services.call.turnVideoOff();
    }

    const toggleVideo = () => {
        if (!videoOn) {
            startVideo();
        } else {
            endVideo();
        }
    }

    const startScreen = () => {
        navigator.mediaDevices.getDisplayMedia({
            audio: false,
            video: {
                width: { ideal: 800, max: 800 },
                height: { ideal: 400, max: 400 }
            }
        }).then(function (stream: any) {
            console.log('Access granted to screen/screen');
            myScreenStream = stream;
            screenStreams[myHumanId] = stream;
            screenOn = true;
            let meVideo = document.getElementById('me-screen')
            if (meVideo) (meVideo as HTMLVideoElement).srcObject = myScreenStream;
            Object.values(connections).forEach(conn => {
                if (conn) {
                    callWithScreenStream(conn.peer);
                }
            });
        },
            function () {
                console.log('Access denied for screen/screen')
                alert(
                    'You chose not to provide access to the screenshare.',
                )
            },
        );
    }

    const endScreen = () => {
        if (myScreenStream !== undefined) {
            myScreenStream.getVideoTracks().forEach((track: any) => {
                track.stop()
            });
        }
        screenOn = false;
        delete screenStreams[myHumanId];
        api.services.call.turnScreenOff();
    }

    const toggleScreen = () => {
        if (!screenOn) {
            startScreen();
        } else {
            endScreen();
        }
    }

    const callWithAudioStream = (peerId: string) => {
        if (myAudioStream) {
            console.log('calling', peerId, 'with audio');
            let call = peer.call(peerId, myAudioStream, { metadata: { type: 'audio' } });
            if (call) {
                audioOutCalls[peerId] = call;
                call.on('close', () => {
                    delete audioOutCalls[peerId];
                    delete audioStreams[peerId];
                    forceUpdate();
                });
                call.on("stream", (remoteStream) => {
                    audioStreams[peerId] = remoteStream;
                    forceUpdate();
                });
                call.on('error', err => {
                    console.log(err);
                });
            }
        } else {
            console.log('cant call', peerId, 'because audio stream is empty');
        }
    }

    const callWithVideoStream = (peerId: string) => {
        if (myVideoStream) {
            console.log('calling', peerId, 'with video');
            let call = peer.call(peerId, myVideoStream, { metadata: { type: 'video' } });
            if (call) {
                videoOutCalls[peerId] = call;
                call.on('close', () => {
                    delete videoOutCalls[peerId];
                    delete videoStreams[peerId];
                    forceUpdate();
                });
                call.on("stream", (remoteStream) => {
                    videoStreams[peerId] = remoteStream;
                    forceUpdate();
                });
                call.on('error', err => {
                    console.log(err);
                });
            }
        } else {
            console.log('cant call', peerId, 'because video stream is empty');
        }
    }

    const callWithScreenStream = (peerId: string) => {
        if (myScreenStream) {
            console.log('calling', peerId, 'with screen');
            let call = peer.call(peerId, myScreenStream, { metadata: { type: 'screen' } });
            if (call) {
                screenOutCalls[peerId] = call;
                call.on('close', () => {
                    delete screenOutCalls[peerId];
                    delete screenStreams[peerId];
                    forceUpdate();
                });
                call.on("stream", (remoteStream) => {
                    screenStreams[peerId] = remoteStream;
                    forceUpdate();
                });
                call.on('error', err => {
                    console.log(err);
                });
            }
        } else {
            console.log('cant call', peerId, 'because audio stream is empty');
        }
    }

    const startAudio = () => {
        navigator.getUserMedia(
            {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            },
            function (stream: any) {
                console.log('Access granted to audio/audio');
                myAudioStream = stream;
                audioStreams[myHumanId] = stream;
                audioOn = true;
                Object.values(connections).forEach(conn => {
                    if (conn) {
                        callWithAudioStream(conn.peer);
                    }
                });
            },
            function () {
                console.log('Access denied for audio/audio')
                alert(
                    'You chose not to provide access to the camera/microphone.',
                )
            },
        );
    }

    const endAudio = () => {
        if (myAudioStream !== undefined) {
            myAudioStream.getTracks().forEach((track: any) => {
                track.stop();
            });
        }
        audioOn = false;
        delete audioStreams[myHumanId];
        api.services.call.turnAudioOff();
    }

    const toggleAudio = () => {
        if (!audioOn) {
            startAudio();
        } else {
            endAudio();
        }
    }

    React.useEffect(() => {

        const startTimer = () => {
            timerInterval = setInterval(() => {
                let currentTime: any = new Date();
                let diff: any = currentTime - startTime;
                let timervalue = millisToMinutesAndSeconds(diff);
                if (timervalue.startsWith('N')) {
                    setTimer('00:00');
                } else {
                    setTimer(timervalue);
                }
            }, 1000);
        }

        const openCall = (towerId: string, roomId: string) => {
            if (loadedRef.current === false) {
                if (once === false) {
                    once = true;
                    peer = new Peer(myHumanId, {
                        host: config.PEERJS_ADDRESS,
                        port: 3001,
                        path: '/peerjs',
                        config: { iceServers: ICE_SERVERS }
                    });
                    peer.on("connection", (conn) => {
                        console.log('connection created : ', conn.peer);
                        connections[conn.peer] = conn;
                        conn.on("open", () => {
                            console.log('connection opened to ', conn.peer);
                            callWithVideoStream(conn.peer);
                            callWithScreenStream(conn.peer);
                            callWithAudioStream(conn.peer);
                        });
                    });
                    peer.on("call", (call) => {
                        console.log('recevied call from', call.peer, 'of type', call.metadata.type);
                        if (call.metadata.type === 'video') {
                            videoInCalls[call.peer] = call;
                            call.answer(myVideoStream);
                            call.on("stream", (remoteStream) => {
                                videoStreams[call.peer] = remoteStream;
                                forceUpdate();
                            });
                            call.on('error', err => {
                                console.log(err);
                            });
                        } else if (call.metadata.type === 'screen') {
                            screenInCalls[call.peer] = call;
                            call.answer(myScreenStream);
                            call.on("stream", (remoteStream) => {
                                screenStreams[call.peer] = remoteStream;
                                forceUpdate();
                            });
                            call.on('error', err => {
                                console.log(err);
                            });
                        } else if (call.metadata.type === 'audio') {
                            audioInCalls[call.peer] = call;
                            call.answer(myAudioStream);
                            call.on("stream", (remoteStream) => {
                                audioStreams[call.peer] = remoteStream;
                                forceUpdate();
                            });
                            call.on('error', err => {
                                console.log(err);
                            });
                        }
                    });
                    peer.on('open', () => {
                        console.log('connection to peer server opened');
                        api.services.call.onPeerJoinedCall('call-page', (data: any) => {
                            let { humanId } = data
                            console.log(humanId, 'joined');
                            if (humanId !== myHumanId) {
                                updaters[humanId] = hookstate(Math.random())
                                users[humanId] = true;
                                forceUpdate();
                                connections[humanId] = peer.connect(humanId);
                            }
                        });
                        api.services.call.onPeerTurnedVideoOff('call-page', (data: any) => {
                            let { humanId } = data
                            if (humanId !== myHumanId) {
                                console.log(humanId, 'turned off video');
                                delete videoStreams[humanId];
                                forceUpdate();
                            }
                        });
                        api.services.call.onPeerTurnedScreenOff('call-page', (data: any) => {
                            let { humanId } = data
                            if (humanId !== myHumanId) {
                                console.log(humanId, 'turned off screen');
                                delete screenStreams[humanId];
                                forceUpdate();
                            }
                        });
                        api.services.call.onPeerTurnedAudioOff('call-page', (data: any) => {
                            let { humanId } = data
                            if (humanId !== myHumanId) {
                                console.log(humanId, 'turned off audio');
                                delete audioStreams[humanId];
                                forceUpdate();
                            }
                        });
                        api.services.call.onPeerLeftCall('call-page', (data: any) => {
                            let { humanId } = data
                            console.log(humanId, 'left');
                            if (humanId !== myHumanId) {
                                connections[humanId]?.close();
                                delete connections[humanId];
                                videoInCalls[humanId]?.close();
                                delete videoInCalls[humanId];
                                screenInCalls[humanId]?.close();
                                delete screenInCalls[humanId];
                                audioInCalls[humanId]?.close();
                                delete audioInCalls[humanId];
                                videoOutCalls[humanId]?.close();
                                delete videoOutCalls[humanId];
                                screenOutCalls[humanId]?.close();
                                delete screenOutCalls[humanId];
                                audioOutCalls[humanId]?.close();
                                delete audioOutCalls[humanId];
                                delete videoStreams[humanId];
                                delete screenStreams[humanId];
                                delete audioStreams[humanId];
                                delete users[humanId];
                                delete updaters[humanId];
                                forceUpdate();
                            }
                        });
                    });
                }
            }
            if (extOpen) {
                bigUserId = myHumanId
                api.services.call.joinCall({ towerId, roomId }).then((body: any) => {
                    let { userIds } = body
                    userIds.forEach((userId: any) => {
                        updaters[userId] = hookstate(Math.random())
                        users[userId] = true
                        if (userId !== myHumanId) {
                            console.log('connecting to', userId);
                            connections[userId] = peer.connect(userId);
                        }
                    });
                });
            }
        }

        viewCallPage = (room: any) => {
            setOpen(true);
            let human = api.memory.humans[myHumanId].get({ noproxy: true });
            if (room && spaceRef.current) {
                if (room.id !== (spaceRef.current as any).id) {
                    if (window.confirm('you are already in another call. if you join this call, your current call will be ended. would you like to do so ?')) {

                        exit();

                        spaceRef.current = undefined;
                        setTimer('00:00');
                        startTimer();

                        spaceRef.current = room;
                        userRef.current = human

                        extOpen = true;
                        startTime = new Date();
                        openCall(room.towerId, room.id);
                    } else {
                        close();
                    }
                } else {
                    extOpen = true;
                }
            } else if (room && !spaceRef.current) {

                spaceRef.current = room;
                userRef.current = human;

                extOpen = true;
                startTime = new Date();
                startTimer();
                openCall(room.towerId, room.id);
            } else if (!room && spaceRef.current) {
                extOpen = true;
            } else if (!room && !spaceRef.current) {
                close();
            }
            setTimeout(() => {
                try {
                    if (titleRef.current) {
                        if (human) {
                            (titleRef.current as HTMLElement).innerHTML = human.firstName + ' ' + human.lastName;
                        } else {
                            (titleRef.current as HTMLElement).innerHTML = room.title;
                        }
                    }
                } catch (ex) { }
            }, 500);
        }

        viewCallPage(props.room)

        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, []);

    return (
        <div style={{ width: '100%', height: '100%', backgroundColor: themeColor.get({ noproxy: true })[50] }}>
            <div style={{
                width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexWrap: 'wrap',
                textAlign: 'center', justifyContent: 'center', alignItems: 'center', alignContent: 'flex-start',
                paddingTop: statusbarHeight() + 32
            }}>
                {
                    Object.keys(users).map(userId => {
                        return (
                            <Paper
                                style={{
                                    margin: 8,
                                    width: 150,
                                    height: 150,
                                    backgroundColor: themeColor.get({ noproxy: true })[100]
                                }}
                                elevation={0}
                            >
                                <Block userId={userId} />
                            </Paper>
                        )
                    })
                }
                <div style={{ width: '100%', height: statusbarHeight() + 48 }} />
            </div>
            <Paper style={{ paddingTop: 8, paddingBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', height: 72, borderRadius: 0, position: 'absolute', left: 0, bottom: 0 }}>
                <SigmaFab style={{ marginRight: 8 }} onClick={toggleScreen}>
                    <ScreenShare />
                </SigmaFab>
                <SigmaFab style={{ marginLeft: 8, marginRight: 8 }} onClick={toggleAudio}>
                    <Mic />
                </SigmaFab>
                <SigmaFab style={{ marginLeft: 8 }} onClick={toggleVideo}>
                    <Videocam />
                </SigmaFab>
            </Paper>
        </div>
    )
}

export default Call
