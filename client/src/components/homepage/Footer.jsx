import React from 'react';
import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="max-w-[1240px] mx-auto py-16 px-4 text-gray-300">
      <div>
        <h1 className="w-full text-3xl font-bold text-accent">Versus.</h1>
        <p className="py-4">A melhor empresa de gerenciamento de torneios online.</p>
        <div className="flex justify-start space-x-6 my-6">
          <FaFacebookSquare size={30} />
          <FaInstagram size={30} />
          <FaTwitterSquare size={30} />
          <FaGithubSquare size={30} />
          <FaDribbbleSquare size={30} />
        </div>
      </div>
      {/* Bottom copyright */}
      <div className="border-t border-gray-700 py-6 text-center text-gray-500 text-sm mt-10">
        &copy; {new Date().getFullYear()} Versus. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Footer;
