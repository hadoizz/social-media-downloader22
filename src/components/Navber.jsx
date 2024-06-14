import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navber() {
  return (
    <header className='flex justify-between p-2 shadow-md bg-black'>
        <h2 className='md:hidden text-xl font-bold py-2 text-yellow-500'>
            <Link to='/'>SMD</Link>
        </h2>

        <h2 className='hidden md:block text-xl font-bold py-2 text-yellow-500'>
            <Link to='/'>Social Media Downloader</Link>
        </h2>

        <nav>
            <ul className='flex justify-between'>
                <li className='m-2 font-bold'>
                    <NavLink className={({ isActive }) => 
                        isActive ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-yellow-500 hover:text-yellow-600'
                    } to='/'>Home</NavLink>
                </li>
                <li className='m-2 font-bold'>
                    <NavLink className={({ isActive }) => 
                        isActive ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-yellow-500 hover:text-yellow-600'
                    } to='/yt-mp3'>YT to Mp3</NavLink>
                </li>
            </ul>
        </nav>
    </header>
  );
}
