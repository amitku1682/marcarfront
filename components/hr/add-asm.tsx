// components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import api, { RequestError, showErrorMessage } from '../../core/api';
import ENDPOINTS from '@/core/endpoints';

interface AddAsmFormProps {
  onSuccess?: () => void; // Callback for success, you can customize this
}

const AddAsmForm: React.FC<AddAsmFormProps> = ({ onSuccess }) => {
  const [asmName, setAsmName] = useState('');
  const [asmUsername, setAsmUsername] = useState('');
  const [email, setEmail] = useState('');

  const addAsmMutation = useMutation(
    (data: any) => api.post('/hr/admin/asm/add', data), // Adjust the endpoint
    {
      onSuccess: () => {
        // Handle success, e.g., show a success message, refresh data, etc.
        console.log('ASM added successfully');
        if (onSuccess) onSuccess();
      },
      onError: (error: RequestError) => {
        // Handle error, e.g., show an error message
        showErrorMessage({ error });
      },
    }
  );

  const handleAddAsm = async () => {
    try {
      await addAsmMutation.mutateAsync({ asmName, asmUsername, email });
    } catch (error) {
      console.error('Add ASM error:', error);
    }
  };

  return (
    <div>
      <h2>Add ASM Form</h2>
      <form>
        <div>
          <label htmlFor="asmName">Name <span className="mandatory-star">*</span></label>
          <input
            type="text"
            id="asmName"
            value={asmName}
            onChange={(e) => setAsmName(e.target.value)}
            className="form-control regex-validation"
            maxLength={50}
            required
          />
        </div>
        <div>
          <label htmlFor="asmUsername">Mobile number <span className="mandatory-star">*</span></label>
          <input
            type="text"
            id="asmUsername"
            value={asmUsername}
            onChange={(e) => setAsmUsername(e.target.value)}
            className="form-control regex-validation"
            data-rule-number="true"
            minLength={10}
            maxLength={10}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            maxLength={50}
          />
        </div>
        <button type="button" onClick={handleAddAsm} disabled={addAsmMutation.isLoading}>
          {addAsmMutation.isLoading ? 'Adding ASM...' : 'Add ASM'}
        </button>
      </form>
    </div>
  );
};

export default AddAsmForm;
