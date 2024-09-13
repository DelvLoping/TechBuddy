'use client';
import { useEffect, useRef } from 'react';
import FAQ from '@/components/macro/FAQ';
import { QuestionsList } from '@/constant/faq';
import { useRouter } from 'next/navigation';
import _ from 'lodash';

export default function Faq() {
  const router = useRouter();
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex flex-row justify-center items-center px-0 lg:py-8 lg:px-32'>
        <div className='flex flex-col gap-4 lg:gap-8 justify-center items-center '>
          <h1 className='text-3xl lg:text-5xl font-bold text-warning text-center leading-none'>
            FAQs
          </h1>
          <p className='text-black/60 text-base lg:text-lg text-center'>
            We answer questions you might have on several topics.
          </p>
        </div>
      </div>
      <div className='w-full flex flex-col pt-8 px-0 lg:px-32 gap-8 lg:gap-16'>
        {_.map(QuestionsList, (question, index) => {
          const { category, questions } = question || {};
          return (
            <div className='bg-white rounded-xl border border-lavender shadow-md'>
              <FAQ
                title={category}
                questions={questions}
                questionClassName='gap-6'
                isDefaultOpen={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
