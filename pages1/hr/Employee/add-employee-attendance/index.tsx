import React, { useState, useEffect, useRef } from "react";
import Swal from 'sweetalert2';
import Webcam from "react-webcam";
import Button from "@/components/bootstrap/Button";
import PageWrapper from "@/layout/PageWrapper/PageWrapper";
import Page from "@/layout/Page/Page";
import * as faceapi from 'face-api.js';
import axios from 'axios';
type CreateUserResponse = {
  statusCode: number;
  success: string;
  payload?: {
    message: string;
  };
};
const EmployeeAttendance = () => {
  const [cameraStatus, setCameraStatus] = useState('opened');
  const [message, setMessage] = useState('');
  const [outline, setOutline] = useState('');
  const webcamRef = useRef();
  const detection = useRef();
  let counter = 0;

  const loadFaceApiModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
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
          console.log(faceDescriptor);
          takeScreenshotAndAuthenticate(faceDescriptor);
        }
      } else {
        // takeScreenshotAndAuthenticate();
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
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();

      // Make API call with the screenshot and face descriptor
      registerUser(screenshot, faceDescriptor);
    }
  };

  const registerUser = async (screenshot, faceDescriptor) => {
    try {
      console.log(screenshot);
      const data = {
        userID: 10,
        employeeID: 'MCC-0011',
        screenshot,
        descriptor: faceDescriptor ? Array.from(faceDescriptor) : [],
      };

      console.log(data);
       // Assuming you have the token value stored in a variable named 'token'
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNjMwMTk5MiwiZXhwIjoxNzA2Mzg4MzkyfQ.gHA1pU5polnKMiFUQoETmjUICUJWTcjDPgrY_ySfe_I';

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
      const response = await axios.post('http://localhost:3013/api/hr/faceRegisters', data ,{ headers });
      console.log('Response:', response);

      if (response.status === 200 && response.data.success === 'true') {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Handle error cases
        console.error('API call failed:', response.status, response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Oops! Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('API call failed:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Oops! Something went wrong. Please try again.',
      });
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(detection.current);
    };
  }, [cameraStatus]);

  return (
    <PageWrapper isProtected={false}>
    <Page className=''>
      <div className='d-flex align-items-center justify-content-center h-40 w-40'>
        <div
          className='col-xl-6 rounded'
          style={{
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div className='text-center'>
            <h2 className='font-weight-bold'>Employee Attendance Verification</h2>
            <p className="lead mb-4">
              Please ensure your face is clearly visible in the camera for attendance verification.
            </p>
          </div>
          <div className="camera-face-overlay justify-content-center" style={{ borderColor: outline }}>
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
              mirrored={true}
              videoConstraints={{ facingMode: 'user' }}
              onUserMedia={handleStreamVideo}
              onUserMediaError={() => setCameraStatus('closed')}
            />
          )}
          <div className="d-flex justify-content-center mt-3">
            <Button
              className={`btn ${outline === '#00ff00' ? 'btn-success' : 'btn-primary'} mt-3 mx-2`}
              onClick={takeScreenshotAndAuthenticate}
            >
              {cameraStatus === 'opened' ? 'Attendance Processing ...' : 'Open Camera'}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  </PageWrapper>
  
  );
};



export default EmployeeAttendance;
