import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
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

  const tokenContractAddress = 'YOUR_TOKEN_CONTRACT_ADDRESS'; // Replace with your token contract address
  const tokenDecimals = 18; // Replace with your token decimals if different

  // ERC-20 Token ABI for balanceOf function
  const tokenABI = [
    'function balanceOf(address owner) view returns (uint256)',
  ];

  useEffect(() => {
    // Check if the wallet is already connected on initial load
    const checkWalletConnection = async () => {
      // Check for MetaMask connection
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            walletAddress: accounts[0],
          }));
          fetchAvailableTokens(accounts[0]);
        }
      }

      // Check for Diam wallet connection
      if (window.diam) {
        // Attempt to connect to Diam wallet
        handleConnectDiamWallet(); // Corrected function name here
      }
    };
    checkWalletConnection();
  }, []);

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

        // Fetch available tokens in the wallet
        await fetchAvailableTokens(account);

        setIsConnected(true);
        setShowForm(false);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Function to connect to Diam wallet
  const handleConnectDiamWallet = () => {
    if (window.diam) {
      window.diam.connect()
        .then((result) => {
          const publicKey = result.message[0];
          console.log(`User active public key is: ${publicKey}`);
          setUserInfo((prevInfo) => ({
            ...prevInfo,
            walletAddress: publicKey,
          }));
          setIsConnected(true);
          fetchAvailableTokens(publicKey); // Adjust this to fetch any specific tokens for Diam wallet if needed
        })
        .catch((error) => {
          console.error(`Error connecting to Diam wallet: ${error}`);
        });
    } else {
      alert('Please install the Diam Wallet extension!');
    }
  };

  // Function to disconnect the wallet
  const handleDisconnectWallet = () => {
    setIsConnected(false);
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      walletAddress: '',
    }));
    setAvailableTokens(0);
    setShowForm(false); // Close the form if it's open
  };

  // Function to fetch available tokens in the wallet
  const fetchAvailableTokens = async (account) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(tokenContractAddress, tokenABI, provider);
      
      // Call the balanceOf function to get the token balance
      const balance = await tokenContract.balanceOf(account);
      
      // Convert balance from BigNumber to a float format
      const formattedBalance = parseFloat(ethers.utils.formatUnits(balance, tokenDecimals));
      setAvailableTokens(formattedBalance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
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
        </div>

        <div className="info-section wallet-info">
          <h2>Wallet Info</h2>
          <p><strong>Wallet Address:</strong> <span>{isConnected ? userInfo.walletAddress : 'Not connected'}</span></p>
          <p><strong>Available Tokens:</strong> <span className="token-amount">{isConnected ? availableTokens.toFixed(4) : 'Not connected'}</span></p>
          {isConnected && (
            <button className="disconnect-button" onClick={handleDisconnectWallet}>Disconnect Wallet</button>
          )}
          {!isConnected && (
            <div className="button-group">
              <button className="connect-button" onClick={handleConnectWallet}>Connect to MetaMask</button>
              <button className="connect-button" onClick={handleConnectDiamWallet}>Connect to Diam Wallet</button>
              <button className="create-button" onClick={handleCreateWallet}>Install Diam Wallet</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
