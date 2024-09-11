import { HelperApplication, HelpRequest } from '@prisma/client';
import AILink from '@/components/macro/Home/AiLink';
import HelpRequestsList from '@/components/macro/Home/HelpRequestsList';
import Profile from '@/components/macro/Home/Profile';
import HelperApplicationList from '@/components/macro/Home/HelperApplicationsList';
import FaqLink from '@/components/macro/Home/FaqLink';
type HomeTechBuddyProps = {
  helperApplication: HelperApplication[];
  helpRequests: HelpRequest[];
};
const HomeTechBuddy = ({ helpRequests, helperApplication }: HomeTechBuddyProps) => {
  return (
    <>
      <Profile />
      <AILink />
      <HelperApplicationList helperApplication={helperApplication} />
      <HelpRequestsList helpRequests={helpRequests} isTechBuddy={true} />
      <FaqLink />
    </>
  );
};
export default HomeTechBuddy;
