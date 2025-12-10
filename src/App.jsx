import { Route } from 'react-router'
import './App.css'
import { HashRouter, Routes } from 'react-router'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Users from './components/Users'
import UserCollection from './components/UserCollection'

function App() {
  return <HashRouter>
    <Navigation />
    <Routes>
      <Route path="/" element={<Users />}></Route>
      <Route path="/my-collection" element={<Home />}></Route>
      <Route path="/collection/:userId" element={<UserCollection />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
    </Routes>
  </HashRouter>
}

export default App
