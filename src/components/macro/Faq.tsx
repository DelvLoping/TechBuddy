import React from 'react';
import _ from 'lodash';
import Question from '@/components/macro/Question';

type FAQProps = {
  title: string;
  questions: { title: string; content: string }[];
  questionClassName?: string;
  isDefaultOpen?: boolean;
};

const FAQ = ({ title, questions, questionClassName, isDefaultOpen = false }: FAQProps) => {
  return (
    <div className='w-full flex flex-col'>
      <div className='w-full flex flex-col p-6 lg:p-8'>
        <h1 className='text-lg sm:text-2xl font-semibold text-black'>{title}</h1>
      </div>
      {_.map(questions, (question, index) => {
        const { title, content } = question || {};
        return (
          <>
            <hr className='w-full border border-lavender' />
            <Question
              key={index + 'question'}
              title={title}
              content={content}
              className={questionClassName}
              isDefaultOpen={isDefaultOpen}
            />
          </>
        );
      })}
    </div>
  );
};

export default FAQ;