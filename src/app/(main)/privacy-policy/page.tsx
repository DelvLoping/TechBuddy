'use client';

export default function PrivacyPolicy() {
  return (
    <div className='w-full flex flex-col px-4 lg:px-32'>
      <div className='w-full flex flex-col'>
        <h1 className='text-3xl lg:text-5xl font-bold text-primary text-center mb-6'>
          Privacy Policy
        </h1>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          At TechBuddy, accessible from {process.env.NEXT_PUBLIC_ORIGIN}, one of our main priorities
          is the privacy of our visitors. This Privacy Policy document contains types of information
          that is collected and recorded by TechBuddy and how we use it.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>1. Information We Collect</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          We collect several types of information for various purposes to provide and improve our
          service to you. This information may include:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li className='text-black/60 text-base lg:text-lg'>
            Personal Data: We may collect personal information such as your name, email address, and
            phone number.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            Usage Data: We may collect data on how you access and use our service, such as your IP
            address, browser type, and pages visited.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            Cookies and Tracking Technologies: We use cookies and similar tracking technologies to
            track the activity on our service and hold certain information.
          </li>
        </ul>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>2. How We Use Your Data</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          TechBuddy uses the collected data for various purposes, including:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li className='text-black/60 text-base lg:text-lg'>
            To provide and maintain our service.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            To notify you about changes to our service.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            To allow you to participate in interactive features of our service.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>To provide customer support.</li>
          <li className='text-black/60 text-base lg:text-lg'>
            To gather analysis or valuable information so that we can improve our service.
          </li>
        </ul>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>3. Data Protection Rights</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          Depending on your location, you may have the following data protection rights:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li className='text-black/60 text-base lg:text-lg'>
            The right to access – You have the right to request copies of your personal data.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            The right to rectification – You have the right to request that we correct any
            information you believe is inaccurate or complete information you believe is incomplete.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            The right to erasure – You have the right to request that we erase your personal data,
            under certain conditions.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            The right to restrict processing – You have the right to request that we restrict the
            processing of your personal data, under certain conditions.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            The right to object to processing – You have the right to object to our processing of
            your personal data, under certain conditions.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            The right to data portability – You have the right to request that we transfer the data
            that we have collected to another organization, or directly to you, under certain
            conditions.
          </li>
        </ul>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>4. Security of Data</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          We use administrative, technical, and physical security measures to help protect your
          personal information. While we have taken reasonable steps to secure the personal
          information you provide to us, please be aware that despite our efforts, no security
          measures are perfect or impenetrable.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>
          5. Changes to This Privacy Policy
        </h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page. You are advised to review this Privacy Policy
          periodically for any changes.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>6. Contact Us</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li className='text-black/60 text-base lg:text-lg'>
            By email: noreply.techbuddy@gmail.com{' '}
          </li>
        </ul>
      </div>
    </div>
  );
}
