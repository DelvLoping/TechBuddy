import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

type CollapseProps = {
  isOpen: boolean;
  className?: string;
};
const Collapse = ({ isOpen, className }: CollapseProps) => {
  return (
    <>{isOpen ? <IoChevronUp className={className} /> : <IoChevronDown className={className} />}</>
  );
};
export default Collapse;