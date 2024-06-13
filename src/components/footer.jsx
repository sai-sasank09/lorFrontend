import React from 'react';
import foorlogo from "../assets/sistlogologin.png";
import Email from "../assets/email.png";
import Linkedin from "../assets/linkedin.png";
import Insta from "../assets/instagram.png";

const Footer = () => {
    return (
        <footer className="bg-[#9e1c3f] text-gray-200">
            <div className="container mx-auto py-8 px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row justify-between items-center">
                <div className="mb-4 lg:mb-0">
                    <img src={foorlogo} alt="University Logo" className="h-auto w-40 lg:w-60" />
                </div>
                <div className="flex flex-wrap justify-center lg:justify-end space-y-4 lg:space-y-0 lg:space-x-8">
                    <FooterLink href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox" icon={Email} text="Mail" />
                    <FooterLink href="https://www.linkedin.com/in/goutham-samineni-099534251/" icon={Linkedin} text="Linkedin" />
                    <FooterLink href="https://www.instagram.com/goutham_samineni/" icon={Insta} text="Instagram" />
                </div>
            </div> 
            <hr className="mx-8 lg:mx-16" />
            <div className="container mx-auto py-2 px-4 text-center text-sm">
                &copy; {new Date().getFullYear()} School of Computing. All rights reserved.
            </div>
        </footer>
    );
};

const FooterLink = ({ href, icon, text }) => {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center group transition duration-300 hover:text-white">
            <img src={icon} alt={text} className="h-6 w-6 mr-2" />
            <p>{text}</p>
        </a>
    );
};

export default Footer;
