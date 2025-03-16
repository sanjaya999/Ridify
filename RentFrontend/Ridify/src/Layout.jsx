import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from "./component/Footer.jsx"
import Nav from './component/Nav.jsx'
import './Style/Layout.css'

function Layout() {
  return (
    <div className="layout-container">
      <Nav />
      <main className="content">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  )
}

export default Layout