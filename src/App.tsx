import { Component } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import LandingPage from './pages/landingpage';
import Dashboard from './pages/dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TambahTransaksi from './pages/tambahtransaksi';
import ForgotPassword from './pages/forgotpassword';
import Riwayat from './pages/riwayat';
import Kategori from './pages/kategori';
import Budget from './pages/budget';
import Statistik from './pages/statistik';
import Profile from './pages/profile';
import './styles/App.css';

const App: Component = () => {
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/SignIn" component={SignIn} />
      <Route path="/SignUp" component={SignUp} />
      <Route path="/TambahTransaksi" component={TambahTransaksi} />
      <Route path="/ForgotPassword" component={ForgotPassword} />
      <Route path="/History" component={Riwayat} />
      <Route path="/Kategori" component={Kategori}/>
      <Route path="/Budget" component={Budget} />
      <Route path="/Statistik" component={Statistik} />
      <Route path="/Profile" component={Profile} />
      <Route path="*" component={() => <div>404 - Page Not Found</div>} />
    </Router>
  );
};

export default App;