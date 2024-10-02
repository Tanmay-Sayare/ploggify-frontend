import React, { useState, useCallback } from 'react';
import './Wallet.css';
import * as DiamNet from 'diamnet-sdk';

const Wallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    walletAddress: '',
    diamPublicKey: '',
  });
  const [availableTokens, setAvailableTokens] = useState(0);

  const connectWallet = useCallback(async () => {
    try {
      if (window.diam) {
        console.log('Diam Wallet detected:', window.diam);
        const response = await window.diam.connect();
        console.log('Diam Wallet Response:', response);

        if (response && response.status === 200 && response.message && response.message.length > 0) {
          const walletInfo = response.message[0];
          if (walletInfo.diamPublicKey) {
            setUserInfo((prevInfo) => ({
              ...prevInfo,
              diamPublicKey: walletInfo.diamPublicKey,
              walletAddress: walletInfo.diamPublicKey,
            }));
            setIsConnected(true);
            await fetchBalance(walletInfo.diamPublicKey);
          } else {
            console.warn('Public key not found in the response:', walletInfo);
          }
        } else {
          console.warn('Failed to get a valid wallet response:', response);
        }
      } else {
        alert('Diam Wallet is not available. Please install the extension.');
      }
    } catch (error) {
      console.error('Error connecting to Diam Wallet:', error);
    }
  }, []);

  const fetchBalance = async (publicKey) => {
    try {
      const server = new DiamNet.Server('https://horizon-testnet.diamnet.org');
      const account = await server.loadAccount(publicKey);
      const nativeBalance = account.balances.find(balance => balance.asset_type === 'native');
      setAvailableTokens(nativeBalance ? parseFloat(nativeBalance.balance) : 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const handleDisconnectWallet = () => {
    setIsConnected(false);
    setUserInfo({
      name: 'John Doe',
      email: 'john.doe@example.com',
      walletAddress: '',
      diamPublicKey: '',
    });
    setAvailableTokens(0);
  };

  const handleCreateWallet = () => {
    window.open('https://chromewebstore.google.com/detail/diam-wallet/oakkognifoojdbfjaccegangippipdmn?hl=en', '_blank');
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
        </div>

        <div className="info-section wallet-info">
          <h2>Wallet Info</h2>
          <p><strong>Status:</strong> {isConnected ? 'Connected' : 'Not Connected'}</p>

          {isConnected && (
            <>
              <p><strong>Wallet Address:</strong> {userInfo.walletAddress}</p>
              <p><strong>Diam Public Key:</strong> {userInfo.diamPublicKey}</p>
              <p><strong>Available Tokens:</strong> <span className="token-amount">{availableTokens.toFixed(4)}</span></p>
            </>
          )}

          {isConnected ? (
            <button className="disconnect-button" onClick={handleDisconnectWallet}>Disconnect Wallet</button>
          ) : (
            <div className="button-group">
              <button className="connect-button" onClick={connectWallet}>Connect to Diam Wallet</button>
              <button className="create-button" onClick={handleCreateWallet}>Install Diam Wallet</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
