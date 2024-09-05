'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <head>
        <title>TechBuddy | Home</title>
        <meta
          name='description'
          content='TechBuddy is a elderly care platform that connects seniors with tech-savvy volunteers.'
        />
      </head>
      <main className='flex h-full w-full flex-col items-center '>
        <ul>
          <li>
            {' '}
            <p className='font-bold text-blue-500/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-primary'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-gray-600/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-secondary'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-green-500/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-success'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-cyan-500/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-info'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-yellow-500/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-warning'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-red-500/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-danger'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-gray-100/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-light'>OOOOOOO</span>
          </li>
          <li>
            {' '}
            <p className='font-bold text-gray-900/40'>TTTTTTTT</p>{' '}
            <span className='font-bold text-dark'>OOOOOOO</span>
          </li>
        </ul>
      </main>
    </>
  );
}
