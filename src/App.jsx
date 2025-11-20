import { Route } from 'react-router'
import './App.css'
import { HashRouter, Routes } from 'react-router'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Settings from './components/Settings'
import Users from './components/Users'
import UserCollection from './components/UserCollection'

function App() {
  return <HashRouter>
    <Navigation />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/users" element={<Users />}></Route>
      <Route path="/collection/:userId" element={<UserCollection />}></Route>
      <Route path="/settings" element={<Settings />}></Route>
    </Routes>
  </HashRouter>
}

export default App
