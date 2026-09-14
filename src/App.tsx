import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Referrals from './pages/Referrals'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import RequireAuth from './components/dashboard/RequireAuth'
import DashboardLayout from './components/dashboard/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import Airtime from './pages/dashboard/Airtime'
import Data from './pages/dashboard/Data'
import Tv from './pages/dashboard/Tv'
import Electricity from './pages/dashboard/Electricity'
import FundWallet from './pages/dashboard/FundWallet'
import Transactions from './pages/dashboard/Transactions'
import Profile from './pages/dashboard/Profile'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function MarketingLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function DashboardShell() {
  return (
    <RequireAuth>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<DashboardShell />}>
          <Route index element={<Overview />} />
          <Route path="airtime" element={<Airtime />} />
          <Route path="data" element={<Data />} />
          <Route path="tv" element={<Tv />} />
          <Route path="electricity" element={<Electricity />} />
          <Route path="fund-wallet" element={<FundWallet />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  )
}
