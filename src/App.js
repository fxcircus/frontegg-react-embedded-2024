import './App.css';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AdminPortal,
  useAuth,
  useLoginWithRedirect,
  useAuthActions,
  useTenantsState,
  ContextHolder,
  useFeatureEntitlements,
  usePermissionEntitlements,
  useEntitlements,
  useStepUp,
  useIsSteppedUp
} from "@frontegg/react";
import { jwtDecode } from 'jwt-decode';

function App() {
  const { user, isAuthenticated } = useAuth();
  const { switchTenant } = useAuthActions();
  const { tenants } = useTenantsState();  
  const stepUp = useStepUp();
  const MAX_AGE = 60 * 60;
  const isSteppedUp = useIsSteppedUp({ maxAge: MAX_AGE });
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [showDecodedToken, setShowDecodedToken] = useState(false);
  const [cursorStyle, setCursorStyle] = useState('pointer');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const dropdownRef = useRef(null);
  const { logout } = useAuthActions();
  const navigate = useNavigate();

  const [selectedTenantId, setSelectedTenantId] = useState(user?.tenantId);
  const [selectedTenantName, setSelectedTenantName] = useState('');


  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current path before the user logs out
      console.log(`User is not logged-on. Saving path: ${window.location.pathname}`);
      localStorage.setItem('_REDIRECT_AFTER_LOGIN_', window.location.pathname);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      // Retrieve the original path after login
      const originalRoute = localStorage.getItem('_REDIRECT_AFTER_LOGIN_');
      if (originalRoute) {
        console.log('Redirecting to the original route:', originalRoute);
        navigate(originalRoute);
        localStorage.removeItem('_REDIRECT_AFTER_LOGIN_');
      }
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    // Save the current path before logging out
    console.log(`Clicked logout. Saving path: ${window.location.pathname}`);
    localStorage.setItem('_REDIRECT_AFTER_LOGIN_', window.location.pathname);
    logout(); // Perform the logout action
  };

  const handleTenantSwitch = (tenant) => {
    setSelectedTenantId(tenant.tenantId);
    setSelectedTenantName(tenant.name);
    switchTenant({ tenantId: tenant.tenantId });
    setIsDropdownOpen(false); 
  };
  

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "") {
        setIsAdminPortalOpen(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const showAdminPortal = () => {
    AdminPortal.show();
    setIsAdminPortalOpen(true);
  };

 

  const copyValue = (value, e) => {
    navigator.clipboard.writeText(value);
    setCursorStyle('copy');
    setToastMessage('Copied to clipboard!');
    setTimeout(() => {
      setToastMessage('');
      setCursorStyle('pointer');
    }, 1000); 
  };

  const Entitlements = () => {
    const entitlementKey = "test";
    const featureFlagKey = "feature01";

    const { isEntitled: isFEntitled } = useFeatureEntitlements("test");
    const { isEntitled: isPEntitled } = usePermissionEntitlements("test");
    const { isEntitled: isPEntitled2 } = useEntitlements({ permissionKey: "test" });
    const { isEntitled: isFEntitled2 } = useEntitlements({ featureKey: "test" });
    const { isEntitled: isFEntitledFF } = useEntitlements({ featureKey: "feature01" });

    const hasEntitlement = isFEntitled || isPEntitled || isPEntitled2 || isFEntitled2;

    return (
      <div className="entitlements-section">
        {isFEntitled && <div className="entitlement-item">Your plan includes the "{entitlementKey}" feature.</div>}
        {isPEntitled && <div className="entitlement-item">Your plan includes the "{entitlementKey}" permission.</div>}
        {isPEntitled2 && <div className="entitlement-item">You have a permission with the "{entitlementKey}" key.</div>}
        {isFEntitled2 && <div className="entitlement-item">You have a feature with the "{entitlementKey}" key.</div>}
        {isFEntitledFF && <div className="entitlement-item">Feature Flag "{featureFlagKey}" is on</div>}
        {!hasEntitlement && <div className="entitlement-item">No plans \ features </div>}
      </div>
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleTokenView = () => {
    setShowDecodedToken(!showDecodedToken);
  };

  const tokenContent = user && user.accessToken 
    ? showDecodedToken 
      ? JSON.stringify(jwtDecode(user.accessToken), null, 2) 
      : user.accessToken 
    : '';

  return (
    <div className="App">
      {isAuthenticated ? (
        <div className="user-zone">
          <h1>Welcome to Frontegg 🥚!</h1>
          <p className="intro-text">This app demonstrates Frontegg's authentication and authorization features.</p>
          
          <div className="profile-section">
            <img src={user?.profilePictureUrl} alt={user?.name} referrerPolicy="no-referrer" className="profile-pic" />
            <span className="user-name">{user?.name}</span>
          </div>

          <div className="button-row">
            <div className="button-container">
              {isSteppedUp ? (
                <div className="stepped-up-message">You are STEPPED UP!</div>
              ) : (
                <button className="action-button" onClick={() => stepUp({ maxAge: MAX_AGE })}>
                  Step up MFA
                </button>
              )}
              <p className="button-description">
                Additional verification step before granting access to restricted app areas.
              </p>
            </div>
            <div className="button-container">
              <button className="action-button" onClick={showAdminPortal}>Open Admin Portal</button>
              <p className="button-description">
                Fully self-served, comprehensive set of tools for user-management, authentication, security, and more for your end-users.
              </p>
            </div>
            <div className="button-container">
              <button className="action-button logout-button" onClick={handleLogout}>Logout</button>
              <p className="button-description">End this user session.</p>
            </div>
          </div>
          
          <div className="account-switcher">
            <label className="account-switcher-label">Account Switcher</label>
            <div className="custom-dropdown" onClick={toggleDropdown}>
              <div className="dropdown-selected">{selectedTenantName}</div>
              {isDropdownOpen && ( 
                <div className="dropdown-options">
                  {tenants
                    .filter((tenant) => tenant.tenantId !== selectedTenantId) 
                    .map((option, index) => (
                      <div
                        key={index}
                        className="dropdown-option"
                        onClick={() => handleTenantSwitch(option)}
                      >
                        {option.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>


          <div className="info-layout">
            <div className="left-column">
              <div className="info-section">
                <label className="info-label">User JWT</label>
                <p className="info-description">This JWT token is issued by Frontegg for authenticated users. You can toggle between the encoded and decoded view.</p>
                
                <textarea 
                  className="jwt" 
                  cols="70" 
                  rows="10" 
                  value={tokenContent}
                  readOnly
                  onClick={(e) => copyValue(tokenContent, e)}
                  style={{ cursor: cursorStyle }}
                />
                <div className="toggle-container">
                  <label className="toggle-label">Show Decoded Token</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={showDecodedToken} 
                      onChange={toggleTokenView} 
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </div>
            <div className="right-column">
              <div className="info-section">
                <label className="info-label">User ID</label>
                <p className="info-description">This is your unique User ID (sub) assigned by Frontegg.</p>
                <textarea 
                  cols="35" 
                  readOnly 
                  onClick={(e) => copyValue(user?.id, e)} 
                  style={{ cursor: cursorStyle }}
                >
                  {user?.id}
                </textarea>
              </div>
              <div className="info-section">
                <label className="info-label">Active Account ID</label>
                <p className="info-description">This is the Account ID (tenantId) that is currently associated with this user. When the user logs in, they will be logged into this account.</p>
                <textarea 
                  cols="35" 
                  readOnly 
                  onClick={(e) => copyValue(user?.tenantId, e)} 
                  style={{ cursor: cursorStyle }}
                >
                  {user?.tenantId}
                </textarea>
              </div>
              <div className="info-section">
                <label className="info-label">Entitlements</label>
                <p className="info-description">These are the features and plans you have access to using Frontegg's Entitlements API.</p>
                <Entitlements />
              </div>
            </div>
          </div>

          {/* Toast message */}
          {toastMessage && (
            <div className="toast">
              {toastMessage}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button onClick={() => navigate('/account/login')}>Click me to login</button>
        </div>
      )}
    </div>
  );
}

export default App;
