import axios, { AxiosError } from 'axios';

type CreateUserResponse = {
  statusCode: number;
  success: string;
  payload?: {
    message: string;
  };
};
// Define the component
const FaceAuthComponents = () => {
  

async function createUser() {
  try {
    // Assuming you have the token value stored in a variable named 'token'
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJpYXQiOjE3MDYxODA1NTgsImV4CI6MTcwNjI2Njk1OH0.8oo7-h1w_pl_FR9rO1uoj0';

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const data = {
      userID: 2,
      employeeID: 'MCC-00010',
      descriptor: ['123'],
      screenshot: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/',
    };

    const { status, data: responseData } = await axios.post<CreateUserResponse>(
      'http://localhost:3011/api/hr/faceRegisters',
      data,
      { headers },
    );

    console.log('Response Status:', status);
    console.log('Response Data:', responseData);

    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error Status:', (error as AxiosError).response?.status);
      console.log('Error Data:', (error as AxiosError).response?.data);
      return error.message;
    } else {
      console.log('Unexpected Error:', error);
      return 'An unexpected error occurred';
    }
  }
}

createUser();


  return (
  
      <div></div>
   
  );
};

export default FaceAuthComponents;
