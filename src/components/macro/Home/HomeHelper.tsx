import { HelpRequest } from '@prisma/client';
import HelpRequestsLink from '@/components/macro/Home/HelpRequestsLink';
import HelpRequestsList from '@/components/macro/Home/HelpRequestsList';
import Profile from '@/components/macro/Home/Profile';
import FaqLink from '@/components/macro/Home/FaqLink';
import AILink from '@/components/macro/Home/AILink';

type HomeHelperProps = {
  helpRequests: HelpRequest[];
};
const HomeHelper = ({ helpRequests }: HomeHelperProps) => {
  return (
    <>
      <Profile />
      <HelpRequestsLink />
      <HelpRequestsList helpRequests={helpRequests} isTechBuddy={false} />
      <AILink />
      <FaqLink />
    </>
  );
};
export default HomeHelper;
