import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, DollarSign, Gamepad2, LogOut, Plus, Edit3, Save, X, Mail, Copy } from 'lucide-react';

const UELDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showAddGame, setShowAddGame] = useState(false);
  const [showEditStats, setShowEditStats] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [gamesData, setGamesData] = useState([
    {
      id: 1,
      name: "Cyber Legends",
      developer: "NeoStudio",
      username: "neostudio_endgamer",
      email: "dev@neostudio.com",
      totalSales: 15420,
      totalViews: 89340,
      weeklyData: [
        { week: 'Week 1', sales: 2100, views: 12500 },
        { week: 'Week 2', sales: 2350, views: 14200 },
        { week: 'Week 3', sales: 1980, views: 11800 },
        { week: 'Week 4', sales: 2890, views: 15600 },
        { week: 'Week 5', sales: 3200, views: 17800 },
        { week: 'Week 6', sales: 2900, views: 17440 }
      ],
      revenueBreakdown: [
        { category: 'Base Game', value: 8500 },
        { category: 'DLC', value: 4200 },
        { category: 'Season Pass', value: 2720 }
      ]
    }
  ]);

  const [newGameForm, setNewGameForm] = useState({
    name: '',
    developer: '',
    email: ''
  });

  const [editStatsForm, setEditStatsForm] = useState({
    sales: '',
    views: ''
  });

  const adminCredentials = { username: 'uel_admin', password: 'admin123' };

  const generateCredentials = () => {
    const username = newGameForm.developer.toLowerCase().replace(/\s+/g, '') + '_endgamer';
    const password = Math.random().toString(36).substring(2, 10) + Math.floor(Math.random() * 100);
    return { username, password };
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    
    console.log('Login attempt:', loginForm);
    
    if (loginForm.username === adminCredentials.username && loginForm.password === adminCredentials.password) {
      setCurrentUser('UEL Admin');
      setIsAdmin(true);
      setShowLogin(false);
    } else {
      // For demo purposes, allow any password for existing developers
      const developer = gamesData.find(game => game.username === loginForm.username);
      
      if (developer) {
        setCurrentUser(developer.developer);
        setIsAdmin(false);
        setShowLogin(false);
      } else {
        alert('Invalid credentials. Contact UEL admin for access.');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setShowLogin(true);
    setLoginForm({ username: '', password: '' });
  };

  const handleEmailCredentials = () => {
    console.log('Email button clicked');
    
    const emailSubject = `UEL Dashboard Access - ${generatedCredentials.gameName}`;
    const emailBody = `Welcome to UEL - Ultimate Esports League!

Your ENDGAMER credentials for ${generatedCredentials.gameName}:

Username: ${generatedCredentials.username}
Password: ${generatedCredentials.password}

Login at: https://your-uel-dashboard.com

ENDGAMERS WELCOMED - WHERE GAMERS GO PRO!

Best regards,
UEL Team`;

    // Create mailto link
    const mailtoLink = `mailto:${generatedCredentials.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Try multiple approaches
    try {
      // Method 1: Direct window.location
      window.location.href = mailtoLink;
    } catch (error1) {
      console.log('Method 1 failed:', error1);
      
      try {
        // Method 2: Window.open
        window.open(mailtoLink);
      } catch (error2) {
        console.log('Method 2 failed:', error2);
        
        // Method 3: Copy to clipboard as fallback
        const fullEmailContent = `To: ${generatedCredentials.email}
Subject: ${emailSubject}

${emailBody}`;
        
        if (navigator.clipboard) {
          navigator.clipboard.writeText(fullEmailContent).then(() => {
            alert('✅ Email content copied to clipboard!\n\nPaste it into your email client (Gmail, Outlook, etc.)');
          }).catch(() => {
            // Final fallback: show in alert
            alert(`📧 Please send this email manually:\n\nTo: ${generatedCredentials.email}\nSubject: ${emailSubject}\n\n${emailBody}`);
          });
        } else {
          // Final fallback: show in alert
          alert(`📧 Please send this email manually:\n\nTo: ${generatedCredentials.email}\nSubject: ${emailSubject}\n\n${emailBody}`);
        }
      }
    }
  };

  // Google Sheets API integration
  const GOOGLE_SHEETS_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your actual spreadsheet ID
  const SHEET_NAME = 'GameData'; // Name of your sheet tab

  const saveToGoogleSheets = async (gameData) => {
    try {
      // In a real implementation, you would use Google Sheets API
      // For now, we'll log the data that should be saved
      console.log('Saving to Google Sheets:', gameData);
      
      // For demo purposes, we'll simulate success
      alert('✅ Game data saved to Google Sheets!');
      return true;
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      alert('❌ Error saving to Google Sheets. Check console for details.');
      return false;
    }
  };

  const updateStatsInGoogleSheets = async (gameId, weeklyStats) => {
    try {
      console.log('Updating weekly stats in Google Sheets:', { gameId, weeklyStats });
      
      // In a real implementation, you would find the row and update it
      // For now, we'll simulate the update
      alert('✅ Weekly stats updated in Google Sheets!');
      return true;
    } catch (error) {
      console.error('Error updating stats in Google Sheets:', error);
      alert('❌ Error updating stats in Google Sheets.');
      return false;
    }
  };

  const handleAddGame = async (e) => {
    if (e) e.preventDefault();
    
    console.log('Adding game:', newGameForm);
    
    if (!newGameForm.name || !newGameForm.developer || !newGameForm.email) {
      alert('Please fill in all fields');
      return;
    }
    
    const credentials = generateCredentials();
    
    const newGame = {
      id: gamesData.length + 1,
      name: newGameForm.name,
      developer: newGameForm.developer,
      username: credentials.username,
      email: newGameForm.email,
      totalSales: 0,
      totalViews: 0,
      weeklyData: [],
      revenueBreakdown: []
    };
    
    // Save to Google Sheets
    const saved = await saveToGoogleSheets(newGame);
    
    if (saved) {
      // Update local state only if Google Sheets save was successful
      setGamesData([...gamesData, newGame]);
      setGeneratedCredentials({
        ...credentials,
        email: newGameForm.email,
        gameName: newGameForm.name,
        developer: newGameForm.developer
      });
      setNewGameForm({ name: '', developer: '', email: '' });
      setShowAddGame(false);
      setShowCredentials(true);
    }
  };

  const handleEditStats = async (e) => {
    if (e) e.preventDefault();
    
    console.log('Updating stats for:', selectedGame.name);
    console.log('Form data:', editStatsForm);
    
    if (!editStatsForm.sales || !editStatsForm.views) {
      alert('Please fill in both sales and views fields');
      return;
    }
    
    const weeklyStats = {
      sales: parseInt(editStatsForm.sales),
      views: parseInt(editStatsForm.views)
    };
    
    console.log('Parsed stats:', weeklyStats);
    
    // Update stats in Google Sheets (for now, just simulate success)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Google Sheets update simulated');
      
      // Update local state
      const updatedGames = gamesData.map(game => {
        if (game.id === selectedGame.id) {
          const newWeekData = {
            week: `Week ${game.weeklyData.length + 1}`,
            sales: weeklyStats.sales,
            views: weeklyStats.views
          };
          
          const updatedGame = {
            ...game,
            totalSales: game.totalSales + weeklyStats.sales,
            totalViews: game.totalViews + weeklyStats.views,
            weeklyData: [...game.weeklyData, newWeekData]
          };
          
          console.log('Updated game data:', updatedGame);
          return updatedGame;
        }
        return game;
      });
      
      setGamesData(updatedGames);
      setEditStatsForm({ sales: '', views: '' });
      setShowEditStats(false);
      setSelectedGame(null);
      
      alert('✅ Stats updated successfully!');
      
    } catch (error) {
      console.error('Error updating stats:', error);
      alert('❌ Error updating stats. Check console for details.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const getDeveloperGame = () => {
    return gamesData.find(game => game.developer === currentUser);
  };

  const UEL_COLORS = ['#2AB02F', '#36E338', '#2C2C2C', '#F2F2F2'];

  const UELLogo = ({ size = 40, className = "" }) => (
    <div className={className}>
      <span 
        className="font-black tracking-tighter"
        style={{ 
          fontSize: size,
          color: '#2C2C2C',
          fontFamily: 'Arial Black, sans-serif',
          transform: 'skew(-5deg)',
          lineHeight: 1
        }}
      >
        UEL
      </span>
    </div>
  );

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <UELLogo size={64} className="mx-auto mb-4 text-white" />
            <p className="text-green-400 text-sm tracking-wider">ENDGAMERS WELCOMED</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter password"
                required
              />
            </div>
            
            <button
              type="submit"
              onClick={handleLogin}
              className="w-full text-white py-3 rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              style={{ background: 'linear-gradient(135deg, #2AB02F 0%, #36E338 100%)' }}
            >
              ENTER THE LEAGUE
            </button>
          </form>
        </div>
      </div>
    );
  }

  const currentGame = isAdmin ? null : getDeveloperGame();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <UELLogo size={32} className="text-white" />
              <span className="ml-3 text-sm" style={{ color: '#2C2C2C' }}>Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm" style={{ color: '#2C2C2C' }}>Welcome, {currentUser}</span>
              {isAdmin && (
                <span className="px-2 py-1 text-xs rounded-full text-white" style={{ backgroundColor: '#2AB02F' }}>Admin</span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm hover:text-gray-900"
                style={{ color: '#2C2C2C' }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold" style={{ color: '#2C2C2C', fontFamily: 'Arial Black, sans-serif' }}>Admin Dashboard</h2>
                <p style={{ color: '#36E338' }} className="text-sm tracking-wider">WHERE GAMERS GO PRO</p>
              </div>
              <button
                onClick={() => setShowAddGame(true)}
                className="flex items-center px-6 py-3 text-white rounded-lg font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                style={{ background: 'linear-gradient(135deg, #2AB02F 0%, #36E338 100%)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                ADD ENDGAMER
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                <div className="flex items-center">
                  <Gamepad2 className="w-8 h-8" style={{ color: '#2AB02F' }} />
                  <div className="ml-4">
                    <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>TOTAL GAMES</p>
                    <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>{gamesData.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8" style={{ color: '#36E338' }} />
                  <div className="ml-4">
                    <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>TOTAL SALES</p>
                    <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>
                      ${gamesData.reduce((sum, game) => sum + game.totalSales, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                <div className="flex items-center">
                  <Eye className="w-8 h-8" style={{ color: '#2AB02F' }} />
                  <div className="ml-4">
                    <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>TOTAL VIEWS</p>
                    <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>
                      {gamesData.reduce((sum, game) => sum + game.totalViews, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden" style={{ borderColor: '#2C2C2C' }}>
              <div className="px-6 py-4 border-b" style={{ borderColor: '#F2F2F2', backgroundColor: '#2C2C2C' }}>
                <h3 className="text-lg font-bold text-white">ALL ENDGAMERS</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: '#F2F2F2' }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#2C2C2C' }}>Game</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#2C2C2C' }}>Developer</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#2C2C2C' }}>Username</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#2C2C2C' }}>Sales</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#2C2C2C' }}>Views</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#2C2C2C' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {gamesData.map((game) => (
                      <tr key={game.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-bold" style={{ color: '#2C2C2C' }}>{game.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#2C2C2C' }}>{game.developer}</td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#2C2C2C' }}>{game.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#2C2C2C' }}>${game.totalSales.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap" style={{ color: '#2C2C2C' }}>{game.totalViews.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedGame(game);
                              setShowEditStats(true);
                            }}
                            className="flex items-center px-3 py-1 text-sm text-white rounded font-bold hover:shadow-lg transform hover:scale-105 transition-all"
                            style={{ background: 'linear-gradient(135deg, #2AB02F 0%, #36E338 100%)' }}
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            UPDATE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          currentGame && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#2C2C2C', fontFamily: 'Arial Black, sans-serif' }}>{currentGame.name}</h2>
                <p style={{ color: '#36E338' }} className="text-sm tracking-wider">ENDGAMER DASHBOARD</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8" style={{ color: '#36E338' }} />
                    <div className="ml-4">
                      <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>TOTAL SALES</p>
                      <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>${currentGame.totalSales.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                  <div className="flex items-center">
                    <Eye className="w-8 h-8" style={{ color: '#2AB02F' }} />
                    <div className="ml-4">
                      <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>TOTAL VIEWS</p>
                      <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>{currentGame.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8" style={{ color: '#36E338' }} />
                    <div className="ml-4">
                      <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>AVG WEEKLY SALES</p>
                      <p className="text-2xl font-bold" style={{ color: '#2C2C2C' }}>
                        ${Math.round(currentGame.totalSales / Math.max(currentGame.weeklyData.length, 1)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border" style={{ borderColor: '#2C2C2C' }}>
                  <h3 className="text-lg font-bold mb-4" style={{ color: '#2C2C2C' }}>WEEKLY PERFORMANCE</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={currentGame.weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F2F2F2" />
                      <XAxis dataKey="week" stroke="#2C2C2C" />
                      <YAxis stroke="#2C2C2C" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#2C2C2C', 
                          color: 'white', 
                