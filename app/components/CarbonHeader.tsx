
"use client"

import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Loading
} from '@carbon/react';
import { Search, Notification, Login, Logout } from '@carbon/icons-react';
import { useContext, useState } from 'react';
import { AuthenticationContext } from '../context/AuthContext';
import { useRouter, usePathname } from "next/navigation";
import useAuth from '@/hooks/useAuth';

const CarbonHeader = () => {
  const { data, loading, setAuthState } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Header aria-label="IBM Platform Name">
      <HeaderName href="/" prefix="IBM">
        Academy
      </HeaderName>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Search" onClick={() => ('search click')}>
          <Search size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label="Notifications"
          onClick={() => ('notification click')}>
          <Notification size={20} />
        </HeaderGlobalAction>
        {loading ?
          <HeaderGlobalAction
            aria-label="Logout"
            onClick={() => ('app-Logout click')}
            tooltipAlignment="end">
            <Loading className="" small={true} withOverlay={false} />
          </HeaderGlobalAction>
          : (
            data ?
              <HeaderGlobalAction
                aria-label="Logout"
                onClick={() => ('app-Logout click')}
                tooltipAlignment="end">
                <Logout size={20}
                  onClick={signout}
                />
              </HeaderGlobalAction>
              : (
                <HeaderGlobalAction
                  aria-label="Login"
                  onClick={() => ('app-login click')}
                  tooltipAlignment="end">
                  <Login size={20}
                    onClick={() => {
                      setAuthState({
                        data: null,
                        error: null,
                        loading: true,
                      });
                      if (pathname === "login") return;
                      router.push(`/login`);
                    }}
                  />
                </HeaderGlobalAction>
              )
          )}
      </HeaderGlobalBar>
    </Header>
  );
};

export default CarbonHeader;