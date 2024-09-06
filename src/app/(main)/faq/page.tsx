'use client';
import React from 'react'
import FAQ from '@/components/macro/Faq';
import { dataQuestions, apiQuestions, pricingQuestions } from '@/constant/questions';


export default function Page() {
  return (
    <div className="flex flex-col items-center gap-10 w-full p-4 px-10 md:px-20 h-full mb-10">
        <div className='w-full flex flex-row justify-center items-center pt-8 px-4 lg:py-16 lg:px-32'>
          <div className='flex flex-col gap-4 lg:gap-8 justify-center items-center '>
            <h1 className='text-3xl lg:text-5xl font-bold text-black text-center leading-none'>
              FAQs
            </h1>
            <p className='text-black/60 text-base lg:text-lg text-center'>
              We answer questions you might have on several topics.
            </p>
          </div>
        </div>
        <div className='w-full flex flex-col pt-8 pb-10 lg:pb-64 px-4 lg:px-32 gap-8 lg:gap-16'>
          <div className='bg-white rounded-xl border border-lavender shadow-md'>
            <FAQ
              title={'Data'}
              questions={dataQuestions}
              questionClassName='gap-6'
              isDefaultOpen={true}
            />
          </div>
          <div className='bg-white rounded-xl border border-lavender shadow-md'>
            <FAQ
              title={'API'}
              questions={apiQuestions}
              questionClassName='gap-6'
              isDefaultOpen={true}
            />
          </div>
          <div className='bg-white rounded-xl border border-lavender shadow-md'>
            <FAQ
              title={'Pricing & queries'}
              questions={pricingQuestions}
              questionClassName='gap-6'
              isDefaultOpen={true}
            />
          </div>
        </div>.
    </div>
  );
}