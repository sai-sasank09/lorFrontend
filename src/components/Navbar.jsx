import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import sistlogologin from '../assets/sistlogologin.png';
import { FiMenu } from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [showMenu, setShowMenu] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleThemeToggle = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'coffee' ? 'bumblebee' : 'coffee';
        document.documentElement.setAttribute('data-theme', newTheme);
    };
    const path = location.pathname;
    return (
        <>
            <nav className="flex items-center justify-between z-10 relative bg-[#9e1c3f] p-10 py-3">
                <div className="flex items-center">
                    <a href="/">
                        <img
                            src={sistlogologin}
                            alt="Logo"
                            className="object-scale-down h-35 w-80 px-3 pt-3"
                        />
                    </a>
                </div>
                <div className={`lg:flex items-center space-x-10 text-white ${showMenu ? 'hidden' : 'hidden'}`}>
                    <label className="cursor-pointer grid place-items-center">
                        <input type="checkbox" value="synthwave" className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2" onChange={handleThemeToggle} />
                        <svg className="col-start-1 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        <svg className="col-start-2 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </label>
                    <ul className="flex space-x-4 md:space-x-8">
                        {(path === '/' || path === '/staff/studentCard' || path === '/documents' || path === '/filterStudents' || path === '/stafflogin' || path === '/login' || path === "/student/dashboard") && (
                            <>
                                <li className="text-white"><Link to="/">Home</Link></li>
                                <li className="text-white"><Link to="/about">About</Link></li>
                            </>
                        )}
                        {(path === "/login" || path === "/") && (
                            <li className="text-white">
                                <Link to='/stafflogin'>Faculty Login</Link>
                            </li>
                        )}

                        {location.pathname === '/staff/studentCard' && (
                            <>
                                <li className="text-white">
                                    <Link to="/staff/documents">Documents</Link>
                                </li>
                                <li className="text-white">
                                    <Link to="/staff/filterStudents">Approval List</Link>
                                </li>
                            </>
                        )}
                        {location.pathname === '/staff/documents' && (
                            <>
                                <li className="text-white">
                                    <Link to="/staff/studentCard">Dashboard</Link>
                                </li>
                                <li className="text-white">
                                    <Link to="/staff/filterStudents">Approval List</Link>
                                </li>
                            </>
                        )}
                        {location.pathname === '/staff/filterStudents' && (
                            <>
                                <li className="text-white">
                                    <Link to="/staff/studentCard">Dashboard</Link>
                                </li>
                                <li className="text-white">
                                    <Link to="/staff/documents">Documents</Link>
                                </li>

                            </>
                        )}

                    </ul>
                </div>
                <div className="lg:hidden flex items-center">
                    <button
                        onClick={handleMenuToggle}
                        className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#9e1c3f] focus:ring-white"
                    >
                        <FiMenu size={36} />
                    </button>
                </div>
            </nav>
            {showMenu && (
                <div className="lg:hidden flex flex-col items-center bg-[#9e1c3f] text-white">
                    <a className="py-3" href="/login">Home</a>
                    <a className="py-3" href="/stafflogin">Faculty Login</a>
                    <a className="py-3" href="/login">Student Login</a>
                    <a className="py-3" href="/">About</a>

                    {location.pathname === '/staff/studentCard' && (
                        <>
                            <a className="py-3" href="/staff/documents">Documents</a>
                            <a className="py-3" href="/staff/filterStudents">Approval List</a>
                            <a className="py-3" href="/staff/studentCard">DashBoard</a>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Navbar;
