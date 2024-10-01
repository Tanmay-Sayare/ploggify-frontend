import React, { useState } from 'react';
import './Wallet.css';

function Wallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    walletAddress: '',
  });
  const [availableTokens, setAvailableTokens] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Function to connect to MetaMask
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Update user info with connected wallet address
        setUserInfo((prevInfo) => ({
          ...prevInfo,
          walletAddress: account,
        }));
        setAvailableTokens(100); // Set a default value or fetch from your API
        setIsConnected(true);
        setShowForm(false);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleEditWallet = () => {
    setShowForm(true);
    setWalletInput(userInfo.walletAddress);
    setIsEditMode(true);
  };

  const handleSaveWalletInfo = () => {
    setUserInfo({
      ...userInfo,
      walletAddress: walletInput,
    });
    setAvailableTokens(100); // Set a default value or fetch from your API
    setIsConnected(true);
    setShowForm(false);
  };

  const handleCreateWallet = () => {
    window.open('https://chromewebstore.google.com/detail/diam-wallet/oakkognifoojdbfjaccegangippipdmn?hl=en', '_blank');
  };

  const handleInputChange = (e) => {
    setWalletInput(e.target.value);
  };

  return (
    <div className="wallet-container">
      <div className="wallet-card">
        <div className="glow-effect"></div>
        <h1 className="wallet-title">Diam Wallet</h1>
        
        <div className="info-section user-info">
          <h2>User Info</h2>
          <p><strong>Name:</strong> <span>{userInfo.name}</span></p>
          <p><strong>Email:</strong> <span>{userInfo.email}</span></p>
          <p><strong>Wallet Address:</strong> <span>{isConnected ? userInfo.walletAddress : 'Not connected'}</span></p>
          {isConnected && (
            <button className="edit-button" onClick={handleEditWallet}>Edit Wallet Info</button>
          )}
        </div>

        <div className="info-section wallet-info">
          <h2>Wallet Info</h2>
          <p><strong>Available Tokens:</strong> <span className="token-amount">{isConnected ? availableTokens : 'Not connected'}</span></p>
          {!isConnected && (
            <div className="button-group">
              <button className="connect-button" onClick={handleConnectWallet}>Connect to Wallet</button>
              <button className="create-button" onClick={handleCreateWallet}>Install Diam Wallet</button>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>{isEditMode ? 'Edit Wallet Info' : 'Enter Wallet Info'}</h2>
            <input
              type="text"
              value={walletInput}
              onChange={handleInputChange}
              placeholder="Enter your wallet address"
            />
            <div className="button-group">
              <button onClick={handleSaveWalletInfo}>{isEditMode ? 'Update' : 'Save'}</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
