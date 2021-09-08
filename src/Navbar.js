import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => (
  <ul>
    <li>
      <Link to="/">Box</Link>
    </li>
    <li>
      <Link to="/sphere">Sphere</Link>
    </li>
    <li>
      <Link to="/twist">Twist</Link>
    </li>
  </ul>
);

export default Navbar;