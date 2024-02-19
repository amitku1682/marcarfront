import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

interface IUserProps {
  // Define your user properties here
  id: number;
  // Add other properties as needed
}

interface IAuthContextProps {
  user: string;
  setUser?(...args: unknown[]): unknown;
  userData: Partial<IUserProps>;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string>('');
  const [userData, setUserData] = useState<Partial<IUserProps>>({});

  useEffect(() => {
    // Retrieve data from sessionStorage on component mount
    const storedToken = sessionStorage.getItem('authToken');
    console.log("storedToken")
    const storedUserId = sessionStorage.getItem('userId');
    console.log(storedUserId)

    // console.log(user)

    if (storedToken && storedUserId) {
      // console.log("Hi")
      setUser(storedUserId);
      setUserData({
        id: parseInt(storedUserId),
        token: storedToken,
        // Add other properties as needed
      });
    } else {
      setUser('');
      setUserData({});
    }
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      setUser,
      userData,
    }),
    [user, userData]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
