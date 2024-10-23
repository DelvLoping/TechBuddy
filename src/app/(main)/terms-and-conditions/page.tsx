'use client';

import { useEffect, useState } from 'react';

export default function TermsAndConditions() {
  const [userCountry, setUserCountry] = useState('');

  const fetchUserCountry = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      const userIP = data.ip;

      const countryResponse = await fetch(`https://ipapi.co/${userIP}/country_name/`);
      const country = await countryResponse.text();

      setUserCountry(country);
    } catch (error) {
      console.error('Error fetching user country:', error);
    }
  };

  useEffect(() => {
    fetchUserCountry();
  }, []);

  return (
    <div className='w-full flex flex-col px-4 lg:px-32'>
      <div className='w-full flex flex-col'>
        <h1 className='text-3xl lg:text-5xl font-bold text-primary text-center mb-6'>
          Terms and Conditions
        </h1>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          Welcome to TechBuddy! These Terms and Conditions outline the rules and regulations for the
          use of TechBuddy's Website. By accessing or using our service, you agree to comply with
          these terms.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>1. Introduction</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          These Terms and Conditions govern your use of our website and services. By using the
          TechBuddy platform, you accept these terms in full. If you disagree with any part of these
          terms, you must not use our website.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>2. Use of the Service</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          You must use our service only for lawful purposes and in accordance with these terms. You
          agree not to use the service:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li className='text-black/60 text-base lg:text-lg'>
            In any way that violates any applicable local, national, or international law or
            regulation.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the
            service.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            To transmit or procure the sending of any advertising or promotional material without
            our prior written consent.
          </li>
        </ul>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>3. User Accounts</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          You must create an account to use certain features of our service. You are responsible for
          maintaining the confidentiality of your account details and for all activities that occur
          under your account.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>4. Intellectual Property</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          All content and materials on our website are protected by intellectual property laws and
          are the property of TechBuddy or its licensors. You may not reproduce, distribute, or
          create derivative works from our content without our explicit permission.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>5. Limitation of Liability</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          To the fullest extent permitted by law, TechBuddy will not be liable for any indirect,
          incidental, special, or consequential damages arising out of or in connection with your
          use of our service.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>6. Changes to the Terms</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          We may update these terms from time to time. We will notify you of any changes by posting
          the new terms on this page. You are advised to review these terms periodically for any
          changes.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>7. Governing Law</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          These Terms and Conditions are governed by and construed in accordance with the laws of{' '}
          {userCountry}, and any disputes related to these terms will be subject to the exclusive
          jurisdiction of the courts in {userCountry}.
        </p>
      </div>
    </div>
  );
}
