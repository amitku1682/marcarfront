// pages/index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page when the root URL is accessed
    router.replace('/auth/login');
  }, []);

  // No rendering or loading message to prevent rendering other components
  return null;
};

export default IndexPage;
