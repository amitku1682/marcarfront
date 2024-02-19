import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import Webcam from "react-webcam";
import { NextPage } from 'next';
import Page from '@/layout/Page/Page';
import Button from "@/components/bootstrap/Button";
import * as faceapi from 'face-api.js';
import axios from 'axios';
import Logo from "@/components/Logo";
import Link from "next/link";
import ENDPOINTS from "@/core/endpoints";
import attedenceapi from "../../core/api";

interface ILoginProps {
  isSignUp?: boolean;
}

const Attedence: NextPage<ILoginProps> = ({ isSignUp }) => {
  const [cameraStatus, setCameraStatus] = useState('closed');
  const [message, setMessage] = useState('');
  const [outline, setOutline] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isFaceRecognized, setIsFaceRecognized] = useState(false);
  const webcamRef = useRef<any>();
  const detection = useRef<any>();
  let counter = 0;

  const loadFaceApiModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
  };

  const handleRetakeAttendance = () => {
    setCameraStatus('opened');
    setMessage('');
    setOutline('');
    counter = 0;
    handleStreamVideo();
  };

  const handleStreamVideo = async () => {
    await loadFaceApiModels();

    detection.current = setInterval(async () => {
      if (counter <= 40 && webcamRef.current && webcamRef.current.video) {
        const faces = await faceapi.detectAllFaces(webcamRef.current.video, new faceapi.TinyFaceDetectorOptions());

        if (faces.length === 1 && faces[0].score > 0.5) {
          counter++;
          setOutline('#00ff00');
          setMessage((prevMessage) => 'Stand still for ' + Math.round(4 - (counter / 10)) + ' seconds.');
        } else {
          counter = 0;
          setOutline('#f00000');
          setMessage((prevMessage) => 'Place the face in the oval.');
        }

        if (counter === 40) {
          const faceDescriptor = await getFaceDescriptor();
          takeScreenshotAndAuthenticate(faceDescriptor);
        }
      }
    }, 100);
  };

  const getFaceDescriptor = async () => {
    const detectionResult = await faceapi.detectSingleFace(
      webcamRef.current.video,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detectionResult && detectionResult.score > 0.5) {
      const faceDescriptor = await faceapi.computeFaceDescriptor(
        webcamRef.current.video,
        detectionResult
      );

      return faceDescriptor;
    }

    return null;
  };

  const takeScreenshotAndAuthenticate = async (faceDescriptor) => {
    setCameraStatus('closed');
    setIsFaceRecognized(true);

    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();
      // Make API call with the screenshot and face descriptor
      registerUser(screenshot);
    }
  };

  const registerUser = async (screenshot) => {
    try {
      const base64Data = screenshot.replace(/^data:image\/jpeg;base64,/, '');

      const data = {
        name: employeeId,
        photo: base64Data,
        init_vector: "asdfadsf",
        face_descriptor: "asdfasdfasdf",
        lat: "28.84893",
        lng: "72.7828"
      };

      // Add your logic for custom verification here
      console.log("Custom Verification Logic");

      const authToken = sessionStorage.getItem('authToken');
      const response = await attedenceapi.post(ENDPOINTS.FACEVERIFY, data);

      if (response.status === 200 && response.data.success) {
        // Handle success
        console.log('EMPLOYEE added successfully');
        // Show SweetAlert success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Success !!!',
        });
      } else {
        // Handle error
        console.error('Failed to add EMPLOYEE:', response.status, response.statusText);
        // Show SweetAlert error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add EMPLOYEE. Please try again.',
        });
      }
    } catch (error) {
      console.error('API error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add EMPLOYEE. Please try again.',
      });
    }
  };

  // Function to handle custom verification
  const handleCustomVerify = () => {
    // Replace this with your custom verification logic
    console.log("Custom Verification Button Clicked");
  };

  useEffect(() => {
    const cleanup = () => {
      clearInterval(detection.current);
    };

    return cleanup;
  }, [cameraStatus]);

  return (
    <Page className='p-0'>
      <div className='row h-100 align-items-center justify-content-center'>
        <div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container p-4 text-center rounded border' style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Logo
            src={'/mars-logo.png'}
            alt="Logo Image"
            height={60}
            width={250}
          />
          <p className='text-center'>
            Welcome to the attendance system! Please follow the instructions below to take attendance.
          </p>
          <div className="camera-face-overlay text-center justify-content-center"  style={{ borderColor: outline ,}}>
            <div className="camera-face-message">{message}</div>
          </div>
          {cameraStatus === 'opened' && (
            <Webcam
              className="camera-video"
              id="webcam"
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              screenshotQuality={1}
              width={'100%'}
              borderRadies={'2'}
              mirrored={true}
              videoConstraints={{ facingMode: 'user' }}
              onUserMedia={handleStreamVideo}
              onUserMediaError={() => {
                setCameraStatus('closed');
                setIsFaceRecognized(false);
              }}
            />
          )}
          <div className="mt-3 text-center">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>
          {/* Add the Retake Attendance button */}
          <div className="mt-3 text-center">
            <Button variant="primary" onClick={handleRetakeAttendance} disabled={!isFaceRecognized}>
              Submit
            </Button>
          </div>
          {/* Add the Custom Verification button */}
          <div className="mt-3 text-center">
            <Button variant="secondary" onClick={handleCustomVerify} disabled={!isFaceRecognized}>
              Custom Verify
            </Button>
          </div>
          <div className="mt-3 text-center">
            <Link href={'/auth/login'}>Go Back</Link>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Attedence;
