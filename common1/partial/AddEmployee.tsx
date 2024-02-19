
import React, { FC, useEffect, useState } from 'react';
import Card, { CardBody, CardHeader } from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Swal from 'sweetalert2';
import axios from 'axios';
import ENDPOINTS from '@/core/endpoints';
import api from '@/core/api';
import { useRouter } from 'next/router';
interface ILocation {
  locationId: number;
  name: string;
}

interface Employee {
  employeeId: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  profileImage: string;
  fatherName: string;
  husbandName: string;
  maritalStatus: string;
  previousEmployer: string;
  dateOfBirth: string;
  currentAddress: string;
  permanantAddress: string;
  contactPerson: string;
  relation: string;
  contactNumber: string;
  adhaarNumber: string;
  panNumber: string;
  licenseNumber: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  ifscCode: string;
  joiningPosition: string;
  joiningLocation: string;
  zoneLocation: string;
  joiningCenter: string;
  joiningDate: string;
  reportingTime: string;
  asm:string,
  surperviser:string,
  uanNumber: string;
  pfNumber: string;
  esiNumber: string;
  recruitedBy: string;
  baseSalary: string;
  hraSalary: string;
  conveyanceSalary: string;
  paymentMode: string;
  deductPf: boolean;
  deductEsi: boolean;
  aadhaarProof: boolean;
  panProof: boolean;
  addressProof: boolean;
  educationProof: boolean;
}

interface AddEmployeeFormProps {
  onAddEmployee: (employee: Employee) => void;
  employeedata: Employee;
}

const AddEmployeeForm: FC<AddEmployeeFormProps> = ({ employeedata, onAddEmployee }) => {
const [zoneLocationOptions, setZoneLocationOptions] = useState([]);
const [locations, setLocations] = useState<ILocation[]>([]);
const [joiningPositions, setJoiningPositions] = useState([]);
const [user,setUser]=useState([]);
const [zone ,setZone]=useState([])
const [center,seCenter]=useState([])
const [asset,setAssets] =useState([])
const [supervirser,setsupervirser]=useState([])
const router =useRouter()
const [newEmployee, setNewEmployee] = useState<Employee>({
    employeeId: "",
    password: "",
    firstName : "",
    lastName: "",
    email: "",
    contact: "",
    profileImage: "",
    fatherName: "",
    husbandName: "",
    maritalStatus: "0",
    previousEmployer: "",
    dateOfBirth: "",
    currentAddress: "",
    permanantAddress: "",   
  contactPerson: "",
    relation: "",
    contactNumber: "",
    adhaarNumber: "",
    panNumber: "",
    licenseNumber: "",
    bankName: " ",
    accountNumber: "",
    accountType: "",
    ifscCode: "",
    joiningPosition: '',  // Change the default value to an empty string
    joiningLocation: '',
    zoneLocation: 39,
    joiningCenter: 4,
    asmId: 20,
    supervisorId: 27,
    joiningDate: "",
    reportingTime: "", 
    uanNumber: "",
    pfNumber: "",
    esiNumber: "",
    recruitedBy: "",
    baseSalary: "",
    hraSalary: "",
    conveyanceSalary: "",
    paymentMode: "",
    deductPf: 0,
    deductEsi: 0,
    aadhaarProof: 0,
    panProof: 0,
    addressProof: 0,
     educationProof: 0
  });
  const fetchData = async (apiEndpoint, setDataCallback) => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setDataCallback(data);
    } catch (error) {
      console.error(`Error fetching data from ${apiEndpoint}:`, error);
    }
  };
  
  useEffect(() => {
    // Fetch zone data when the component mounts
    const fetchZones = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.ZONELIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setZone(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, []);
  
  useEffect(() => {
    fetchData('https://marsworld.co.in/api/hr/users', setUser);
  }, []);
  
  useEffect(() => {
    // Fetch location data when the component mounts
    const fetchLocations = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.LOCATIONLIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setLocations(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchJoiningPositions = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.JOININGPOSTION, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setJoiningPositions(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching joining positions:', error);
      }
    };

    fetchJoiningPositions();
  }, []);

  
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.GETASM, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log(response);
        setAssets(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.SUPER, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        console.log(response);
        setsupervirser(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    // Fetch location data when the component mounts
    const fetchLocations = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.CENTER, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        seCenter(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  
  useEffect(() => {
    // Fetch location data when the component mounts
    const fetchLocations = async () => {
      try {
        const storedToken = sessionStorage.getItem('authToken');
        const response = await api.get(ENDPOINTS.LOCATIONLIST, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setLocations(response.data.payload.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

 console.log("locations"+locations)
  const handleInputChange = (field: keyof Employee, value: string | boolean) => {
    setNewEmployee((prevEmployee) => ({ ...prevEmployee, [field]: value }));
  };
  const isFieldFilled = (fieldValue) => fieldValue.trim() !== ''; // Helper function to check if a field is filled

  const isFormValid = () => {
    // List of required fields
    const requiredFields = [
      'employeeId',
      'password',
      'firstName',
      'lastName',
      'email',
      'contact',
      // Add other required fields here
    ];

    // Check if all required fields are filled
    const allFieldsFilled = requiredFields.every((field) => isFieldFilled(newEmployee[field]));

    if (!allFieldsFilled) {
      // SweetAlert notification if any required field is not filled
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please fill in all required fields before submitting.',
      });
    }


    return allFieldsFilled;
  };
  const handleAddEmployee = async () => {

    if (isFormValid()) {

    try {
      const authToken = sessionStorage.getItem('authToken');
      const response = await axios.post('https://marsworld.co.in/api/hr/employee', newEmployee, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });
// console.log(response)
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Employee added successfully!',
        });

        onAddEmployee(newEmployee);

        setNewEmployee({
          employeeId: '',
          password: '',
          firstName: '',
          lastName: '',
          email: '',
          contact: '',
          profileImage: '',
          fatherName: '',
          husbandName: '',
          maritalStatus: '',
          previousEmployer: '',
          dateOfBirth: '',
          currentAddress: '',
          permanantAddress: '',
          contactPerson: '',
          relation: '',
          contactNumber: '',
          adhaarNumber: '',
          panNumber: '',
          licenseNumber: '',
          bankName: '',
          accountNumber: '',
          accountType: '',
          ifscCode: '',
          joiningPosition: '',
          joiningLocation: '',
          zoneLocation: '',
          joiningCenter: '',
          surperviser:'',
          asm:'',
          joiningDate: '',
          reportingTime: '',
          uanNumber: '',
          pfNumber: '',
          esiNumber: '',
          recruitedBy: '',
          baseSalary: '',
          hraSalary: '',
          conveyanceSalary: '',
          paymentMode: '',
          deductPf: false,
          deductEsi: false,
          aadhaarProof: false,
          panProof: false,
          addressProof: false,
          educationProof: false,
        });
        router.push('/hr/Employee/Employee-List')
      } else {
        console.error('Failed to add employee:', response.statusText);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add employee. Please try again.',
        });
      }
    } catch (error) {
      console.error('Employee error:', error);
    }}
  };

  const renderTextField = (label: string, field: keyof Employee, type: string = 'text') => {
    const inputStyle = {
      borderRadius: '5px',
      padding: '8px',
      border: '1px solid #ccc',
    };

    return (
      <div className='col-md-4 mb-3'>
        <label htmlFor={String(field)} className='form-label'>
          {label}
        </label>
        {field === 'dateOfBirth' ? (
          <input
            type='date'
            className='form-control'
            style={inputStyle}
            id={String(field)}
            value={newEmployee[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        ) : (
          <input
            type={type}
            className='form-control'
            style={inputStyle}
            id={String(field)}
            value={newEmployee[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        )}
      </div>
    );
  };

  const formHeaderStyle = {
    backgroundColor: '#222',
    padding: '10px 5px',
    marginBottom: '15px',
    fontSize: '1.5em',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: '8px',
    textAlign: 'center',
  };
  const [storedata, setStoredata] = useState([])
  const [asm, setAsm] = useState([])
  
  
  const getStore = async () => {
      const authToken = sessionStorage.getItem('authToken');
      try {
          const { data } = await axios.get(`https://marsworld.co.in/api/hr/zone`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`,
              },
          })
          // console.log(JSON.stringify(data.payload.data))
          setStoredata(data.payload.data);
      } catch (error: any) {
          // status == 400 it's worng status code on auth error
          if (error?.response?.data == 'Invalid token.') {
              localStorage.removeItem('authToken')
            //  router.push(`/auth/login`);
          }
          console.log({ error })
      }
  }

  const getasm = async () => {
      const authToken = sessionStorage.getItem('authToken');
      try {
          const { data } = await axios.get(`https://marsworld.co.in/api/hr/getAsm`, {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`,
              },
          })
          // console.log(JSON.stringify(data.payload.data))
          setAsm(data.payload.data);
      } catch (error: any) {
          // status == 400 it's worng status code on auth error
          if (error?.response?.data == 'Invalid token.') {
              localStorage.removeItem('authToken')
            //  router.push(`/auth/login`);
          }
          console.log({ error })
      }
  }
//   const store = storedata.map((data, i) => {
//     return (
//         <>
//             {/* <option>Select Store</option> */}
//             <option value={`${data.storeId}`}>{data.name}</option>
//         </>
//     )
// })
// console.log(asm)
const store = asset.map((data, i) => ({
  // <option>Select ASM</option>
  // <option value={`${data.asmId}`}>{data.name}</option>
  value: `${data.storeId}`,
  label: data.name
}));
const zoneLocationOption = asset.map((data, i) => ({
  // <option>Select ASM</option>
  // <option value={`${data.asmId}`}>{data.name}</option>
  value: `${data.zoneId}`,
  label: data.name
}));



// console.log(asm)
const asmOption = asset.map((data, i) => ({
  // <option>Select ASM</option>
  // <option value={`${data.asmId}`}>{data.name}</option>
  value: `${data.userId}`,
  label: data.name
}));



// console.log(asm)
const surperviserOption = supervirser.map((data, i) => ({
  // <option>Select ASM</option>
  // <option value={`${data.asmId}`}>{data.name}</option>
  value: `${data.userId}`,
  label: data.name
}));






// console.log(asm)
const joiningCenterOption = center.map((data, i) => ({
  // <option>Select ASM</option>
  value: data.Id,
  label: data.name
}));

// console.log(asm)
const joiningLocationOption= locations.map((data, i) => ({
  // <option>Select ASM</option>
  // <option value={`${data.asmId}`}>{data.name}</option>
  value: `${data.locationId}`,
  label: data.name
}));



const joiningPositionOptions = joiningPositions.map((data, i) => ({
  value: data.positionId,
  label: data.position,
}));

const joiningCenterOptions = zone.map((data, i) => ({
  value: data.zoneId,
  label: data.name,
}));


// const joiningLocationOption = [
//   { value: 'true', label: 'Education Proof' },
//   { value: 'false', label: 'Not Education Proof' },
// ];

const maritalStatusoption = [
  { value: 'Married', label: 'Married' },
  { value: 'Unmarried', label: 'Unmarried' },
];

useEffect(() => {
  getasm();
  getStore();


}, [])


// {renderCustomSelectField('Joining Position', 'joiningPosition', joiningPositionOptions)}
// {renderCustomSelectField('Joining Location', 'joiningLocation', joiningLocationOption)}
// {renderCustomSelectField('Zone Location', 'zoneLocation', zoneLocationOption)}
// {renderCustomSelectField('Joining Center', 'joiningCenter', joiningCenterOption)}
// {renderCustomSelectField('Asm', 'asm', asmOption)}
// {renderCustomSelectField('Surperviser', 'surperviser',surperviserOption)}
const customSelectStyle = {
  borderRadius: '5px',
  padding: '8px',
  border: '1px solid #ccc',
  width: '100%',
};
// const educationProofOptions = [
//   { value: 'true', label: 'Education Proof' },
//   { value: 'false', label: 'Not Education Proof' },
// ];
const renderCustomSelectField = (label, field, options) => (
  <div className='col-md-4 mb-3 form-check'>
    <label htmlFor={field} className='form-check-label'>
      {label}
    </label>
    <select
      id={field}
      value={newEmployee[field]}
      onChange={(e) => handleInputChange(field, e.target.value)}
      className='form-select mb-3'
      style={customSelectStyle}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);


  return (
    <Card>
      <CardHeader style={formHeaderStyle}>
        <h5>Add Employee Form</h5>
      </CardHeader>
      <CardBody>
        <div className='row'>
          <ul style={{ paddingRight: '10px', marginLeft: '10px' }}>
            <li style={{ padding: '5px 0' }}>Fields marked with * are mandatory.</li>
            <li style={{ padding: '5px 0' }}>Enter NA if the field has no value.</li>
            <li style={{ padding: '5px 0' }}>Upload only PNG, JPG, JPEG images.</li>
          </ul>

          <h5 style={formHeaderStyle}>Personal Information</h5>
          {renderTextField('Employee ID *', 'employeeId')}
          {renderTextField('Password', 'password', 'password')}
          {renderTextField('First Name *', 'firstName')}
          {renderTextField('Last Name', 'lastName')}
          {renderTextField('Email', 'email')}
          {renderTextField('Contact *', 'contact')}
          {/* {renderTextField('Profile Image', 'profileImage')} */}
          {renderTextField('Father Name', 'fatherName')}
          {renderTextField('Husband Name', 'husbandName')}
          {/* {renderTextField('Marital Status', 'maritalStatus')} */}
          {renderCustomSelectField('Marital Status', 'maritalStatus', maritalStatusoption)}
          {renderTextField('Previous Employer', 'previousEmployer')}
          {renderTextField('Date of Birth', 'dateOfBirth')}
          {renderTextField('Current Address', 'currentAddress')}
          {renderTextField('Permanent Address', 'permanantAddress')}

          <h5 style={formHeaderStyle}>Contact Person Information</h5>
          {renderTextField('Contact Person', 'contactPerson')}
          {renderTextField('Relation', 'relation')}
          {renderTextField('Contact Number', 'contactNumber')}

          <h5 style={formHeaderStyle}>Identification Information</h5>
          {renderTextField('Aadhaar Number', 'adhaarNumber')}
          {renderTextField('PAN Number', 'panNumber')}
          {renderTextField('License Number', 'licenseNumber')}

          <h5 style={formHeaderStyle}>Bank Information</h5>
          {renderTextField('Bank Name', 'bankName')}
          {renderTextField('Account Number', 'accountNumber')}
          {renderTextField('Account Type', 'accountType')}
          {renderTextField('IFSC Code', 'ifscCode')}

          <h5 style={formHeaderStyle}>Joining Information</h5>
          {renderCustomSelectField('Joining Position', 'joiningPosition', joiningPositionOptions)}
          {renderCustomSelectField('Joining Location', 'joiningLocation', joiningLocationOption)}


          
          {renderCustomSelectField('Zone Location', 'zoneLocation', joiningCenterOptions)}


          {renderCustomSelectField('Joining Center', 'joiningCenter', joiningCenterOption)}
          {renderCustomSelectField('Asm', 'asm', asmOption)}
          {renderCustomSelectField('Surperviser', 'surperviser',surperviserOption)}
          
          {renderTextField('Joining Date', 'joiningDate', 'date')}
          {renderTextField('Reporting Time', 'reportingTime')}
          
          

      

          <h5 style={formHeaderStyle}>Statutory Information</h5>
          {renderTextField('UAN Number', 'uanNumber')}
          {renderTextField('PF Number', 'pfNumber')}
          {renderTextField('ESI Number', 'esiNumber')}

          <h5 style={formHeaderStyle}>Recruitment Information</h5>
          {renderTextField('Recruited By', 'recruitedBy')}

          <h5 style={formHeaderStyle}>Salary Information</h5>
          {renderTextField('Base Salary', 'baseSalary')}
          {renderTextField('HRA Salary', 'hraSalary')}
          {renderTextField('Conveyance Salary', 'conveyanceSalary')}

          {renderTextField('Payment Mode', 'paymentMode')}

          <h5 style={formHeaderStyle}>Deductions and Proofs</h5>
          <div className='col-md-4 mb-3 form-check'>
            <input
              type='checkbox'
              id='deductPf'
              checked={newEmployee.deductPf}
              onChange={(e) => handleInputChange('deductPf', e.target.checked)}
              className='form-check-input'
            />
            <label htmlFor='deductPf' className='form-check-label'>
              Deduct PF
            </label>
          </div>
          <div className='col-md-4 mb-3 form-check'>
            <input
              type='checkbox'
              id='deductEsi'
              checked={newEmployee.deductEsi}
              onChange={(e) => handleInputChange('deductEsi', e.target.checked)}
              className='form-check-input'
            />
            <label htmlFor='deductEsi' className='form-check-label'>
              Deduct ESI
            </label>
          </div>
          <div className='col-md-4 mb-3 form-check'>
            <input
              type='checkbox'
              id='aadhaarProof'
              checked={newEmployee.aadhaarProof}
              onChange={(e) => handleInputChange('aadhaarProof', e.target.checked)}
              className='form-check-input'
            />
            <label htmlFor='aadhaarProof' className='form-check-label'>
              Aadhaar Proof
            </label>
          </div>
          <div className='col-md-4 mb-3 form-check'>
            <input
              type='checkbox'
              id='panProof'
              checked={newEmployee.panProof}
              onChange={(e) => handleInputChange('panProof', e.target.checked)}
              className='form-check-input'
            />
            <label htmlFor='panProof' className='form-check-label'>
              PAN Proof
            </label>
          </div>
          <div className='col-md-4 mb-3 form-check'>
            <input
              type='checkbox'
              id='addressProof'
              checked={newEmployee.addressProof}
              onChange={(e) => handleInputChange('addressProof', e.target.checked)}
              className='form-check-input'
            />
            <label htmlFor='addressProof' className='form-check-label'>
              Address Proof
            </label>
          </div>
          <div className='col-md-4 mb-3 form-check'>
            <input
              type='checkbox'
              id='educationProof'
              checked={newEmployee.educationProof}
              onChange={(e) => handleInputChange('educationProof', e.target.checked)}
              className='form-check-input'
            />
            <label htmlFor='educationProof' className='form-check-label'>
              Education Proof
            </label>
          </div>
        </div>
        <div className='mt-3'>
          <Button color='success' onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddEmployeeForm;

