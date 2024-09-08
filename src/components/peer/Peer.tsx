import { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { useSelector } from 'react-redux';
import axiosInstance from '@/lib/axiosInstance';
import { Chat } from '@prisma/client';
import moment from 'moment';
import _ from 'lodash';
import { Button } from '@nextui-org/react';
import { HiOutlineVideoCamera, HiOutlineVideoCameraSlash } from 'react-icons/hi2';
import { TbMicrophone, TbMicrophoneOff } from 'react-icons/tb';
import { LuScreenShare, LuScreenShareOff } from 'react-icons/lu';
import { GoScreenFull, GoScreenNormal } from 'react-icons/go';

type PeerPageProps = {
  chatId: string | number;
};
const PeerPage = ({ chatId }: PeerPageProps) => {
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const myId = String(user.id);
  const [peerIdToCall, setPeerIdToCall] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentCall, setCurrentCall] = useState<any>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (chatId) {
      axiosInstance.get(`/chat/${chatId}`).then((res) => {
        if (res.data) {
          setChat(res.data.chat);
        }
      });
    }
  }, [chatId]);

  useEffect(() => {
    if (chat) {
      const users = [chat.user1Id, chat.user2Id];
      if (users.includes(user.id)) {
        setIsAuthorized(true);
        axiosInstance
          .get(`/help-request/${chat.requestId}`)
          .then((res) => {
            if (res.data) {
              const helpRequest = res.data.helpRequest;
              const helperApply = _.find(
                helpRequest.applications,
                (apply) => apply.helperId === chat.user2Id
              );
              if (
                moment(helpRequest.interventionDate).isBefore(moment()) &&
                helpRequest.status !== 'COMPLETED' &&
                helperApply.status === 'ACCEPTED'
              ) {
                setIsOpen(true);
                const peerId = _.find(users, (userId) => userId !== user.id);
                setPeerIdToCall(String(peerId));
              }
            }
          })
          .catch((error) => {
            if (error.response && error.response.data) {
              if (error.response.data.message.includes('Unauthorized')) {
                setIsAuthorized(false);
              }
            }
          });
      }
    }
  }, [chat]);

  useEffect(() => {
    const newPeer = new Peer(myId, {
      host: '/',
      port: 9000,
      path: '/peer'
    });

    setPeer(newPeer);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true
        })
        .then((stream) => {
          setStream(stream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          newPeer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            });
            setCurrentCall(call);
          });

          if (peerIdToCall) {
            const call = newPeer.call(peerIdToCall, stream);
            setCurrentCall(call);

            call.on('stream', (remoteStream) => {
              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
            });
          }
        })
        .catch((err) => {
          console.error('Error accessing media devices', err);
        });
    }

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peerIdToCall]);

  const toggleCamera = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOn(videoTrack.enabled);
    }
  };

  const toggleMicrophone = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicrophoneOn(audioTrack.enabled);
    }
  };

  const startScreenShare = async () => {
    if (!isScreenSharing && stream) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        setScreenStream(screenStream);

        if (myVideoRef.current) {
          myVideoRef.current.srcObject = screenStream;
        }

        const screenTrack = screenStream.getVideoTracks()[0];

        const videoSender = currentCall.peerConnection
          .getSenders()
          .find((s: RTCRtpSender) => s.track?.kind === 'video');

        if (videoSender) {
          await videoSender.replaceTrack(screenTrack);
        }
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error('Error sharing screen: ', err);
      }
    }
  };

  const stopScreenShare = async () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }

    if (stream) {
      const cameraTrack = stream.getVideoTracks()[0];
      const videoSender = currentCall.peerConnection
        .getSenders()
        .find((s: RTCRtpSender) => s.track?.kind === 'video');

      if (videoSender) {
        await videoSender.replaceTrack(cameraTrack);
      }
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      setIsScreenSharing(false);
    }
  };

  return (
    <div
      className={`flex flex-col justify-center items-center h-full gap-4 ${
        isFullScreen && 'sm:flex-row fixed top-0 left-0 w-screen h-screen z-50 bg-black p-4'
      }`}
    >
      {chat ? (
        isAuthorized ? (
          isOpen ? (
            <>
              <video
                className={`${isFullScreen ? 'h-full' : 'h-full'} w-full`}
                playsInline
                ref={remoteVideoRef}
                autoPlay
              />
              <video
                className={`w-full sm:w-36 ${isFullScreen && 'w-36'}`}
                playsInline
                ref={myVideoRef}
                autoPlay
                muted
              />
              <div
                className={`flex flex-row items-center justify-center gap-4 ${
                  isFullScreen && 'sm:absolute bottom-6'
                }`}
              >
                <Button
                  onClick={toggleCamera}
                  className={`p-3 !min-w-[0px] bg-primary text-white w-fit rounded-full
                    ${isCameraOn ? 'bg-primary' : 'bg-red-500'}`}
                >
                  {isCameraOn ? (
                    <HiOutlineVideoCamera className='w-6 h-6' />
                  ) : (
                    <HiOutlineVideoCameraSlash className='w-6 h-6' />
                  )}
                </Button>

                <Button
                  onClick={toggleMicrophone}
                  className={`p-3 !min-w-[0px] bg-primary text-white w-fit rounded-full
                    ${isMicrophoneOn ? 'bg-primary' : 'bg-red-500'}`}
                >
                  {isMicrophoneOn ? (
                    <TbMicrophone className='w-6 h-6' />
                  ) : (
                    <TbMicrophoneOff className='w-6 h-6' />
                  )}
                </Button>

                <Button
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  className={`p-3 !min-w-[0px] bg-primary text-white w-fit rounded-full
                    ${isScreenSharing ? 'bg-red-500' : 'bg-primary'}`}
                >
                  {isScreenSharing ? (
                    <LuScreenShareOff className='w-6 h-6' />
                  ) : (
                    <LuScreenShare className='w-6 h-6' />
                  )}
                </Button>

                <Button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className={`p-3 !min-w-[0px] bg-primary text-white w-fit rounded-full`}
                >
                  {isFullScreen ? (
                    <GoScreenNormal className='w-6 h-6' />
                  ) : (
                    <GoScreenFull className='w-6 h-6' />
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className='text-center'>This help request is not open yet.</div>
          )
        ) : (
          <div className='text-center'>You are not authorized to access this page.</div>
        )
      ) : (
        <div className='text-center'>Loading...</div>
      )}
    </div>
  );
};

export default PeerPage;
