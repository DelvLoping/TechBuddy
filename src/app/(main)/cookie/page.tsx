'use client';

export default function CookiePolicy() {
  return (
    <div className='w-full flex flex-col px-4 lg:px-32'>
      <div className='w-full flex flex-col'>
        <h1 className='text-3xl lg:text-5xl font-bold text-primary text-center mb-6'>
          Cookie Policy
        </h1>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          This Cookie Policy explains what cookies are, how TechBuddy uses cookies, and your choices
          regarding cookies.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>1. What Are Cookies</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          Cookies are small text files that are used to store small pieces of information. They are
          stored on your device when the website is loaded on your browser. Cookies help us enhance
          your browsing experience and analyze site usage.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>2. How TechBuddy Uses Cookies</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          TechBuddy uses cookies for various purposes, including:
        </p>
        <ul className='list-disc pl-6 mb-4'>
          <li className='text-black/60 text-base lg:text-lg'>
            Essential Cookies: We use cookies to remember information that changes the way the
            service behaves or looks, such as your preferred language or the region you are in.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            Account Cookies: We use cookies to manage the signup and login process. These cookies
            will usually be deleted when you log out; however, in some cases, they may remain
            afterward to remember your site preferences.
          </li>
          <li className='text-black/60 text-base lg:text-lg'>
            Analytics Cookies: We use cookies to help us analyze how our visitors use the website
            and to monitor website performance. This helps us provide a high-quality experience by
            customizing our offering and quickly identifying and fixing any issues that arise.
          </li>
        </ul>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>
          3. Your Choices Regarding Cookies
        </h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          You have the right to decide whether to accept or reject cookies. You can set or change
          your web browser controls to accept or reject cookies. If you choose to reject cookies,
          you may still use our website though your access to some functionality and areas of our
          site may be restricted.
        </p>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          Additionally, you can opt-out of third-party cookies used for targeted advertising by
          visiting the Digital Advertising Alliance's Consumer Choice page or the Network
          Advertising Initiative's Opt-Out page.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>
          4. Changes to This Cookie Policy
        </h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          We may update our Cookie Policy from time to time. We will notify you of any changes by
          posting the new Cookie Policy on this page. You are advised to review this Cookie Policy
          periodically for any changes.
        </p>

        <h2 className='text-2xl lg:text-4xl font-bold mt-6 mb-4'>5. Contact Us</h2>
        <p className='text-black/60 text-base lg:text-lg mb-4'>
          If you have any questions about this Cookie Policy, please contact us:
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
