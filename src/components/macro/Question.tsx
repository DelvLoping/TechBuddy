import React from 'react';
import _ from 'lodash';
import Collapse from '@/components/micro/Collapse';
type QuestionProps = {
  title: string;
  content: string;
  className?: string;
  isDefaultOpen?: boolean;
};
const Question = ({ title, content, className, isDefaultOpen = false }: QuestionProps) => {
  const [isOpen, setIsOpen] = React.useState(isDefaultOpen);
  const handleChangeIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`relative w-full flex flex-col p-6 lg:px-8 ${className} cursor-pointer`}
      onClick={handleChangeIsOpen}
    >
      <h1 className='text-base font-semibold text-black pe-6'>{title}</h1>
      <p className={`text-sm text-black/60 font-normal ${isOpen ? 'block' : 'hidden'}`}>
        {content}
      </p>
      <Collapse
        isOpen={isOpen}
        className='h-5 w-5 text-black/70 absolute right-6 lg:right-8 top-6 '
      />
    </div>
  );
};

export default Question;
