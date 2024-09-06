import { HelpRequest } from '@prisma/client';
import moment from 'moment';
import { useSelector } from 'react-redux';

// model HelpRequest {
//     id                    Int                 @id @default(autoincrement())
//     userId                Int
//     subject               String
//     description           String
//     requestDate           DateTime            @default(now())
//     interventionDate      DateTime?
//     interventionType      InterventionType
//     reward                String?
//     interventionAddressId Int?
//     status                RequestStatus       @default(OPEN)
//     user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade)
//     applications          HelperApplication[]
//     chats                 Chat[]
//     evaluations           Evaluation[]
//     interventionAddress   Address?            @relation(fields: [interventionAddressId], references: [id])
//   }

type HelpRequestDetailsProps = {
  helpRequest: HelpRequest;
};
const HelpRequestDetails = ({ helpRequest }: HelpRequestDetailsProps) => {
  const userReducer = useSelector((state) => state.user);
  const { user } = userReducer || {};
  const {
    id,
    userId,
    subject,
    description,
    requestDate,
    status,
    reward,
    interventionDate,
    interventionType,
    interventionAddressId
  } = helpRequest;
  let color = '';
  switch (helpRequest.status) {
    case 'OPEN':
      color = 'text-primary';
      break;
    case 'COMPLETED':
      color = 'text-success';
      break;
    case 'IN_PROGRESS':
      color = 'text-warning';
      break;
  }
  return (
    <div
      key={id + 'HelpRequest'}
      className='flex flex-col p-4 border-b border-gray-300 last:border-none gap-2'
    >
      <div className='flex justify-between items-start'>
        <h4 className='text-base sm:text-xl font-semibold leading-none'>{subject}</h4>
        <p className='text-xs sm:text-sm text-gray-500 text-nowrap'>
          {moment(requestDate).format('ll')}
        </p>
      </div>
      <p className='text-sm sm:text-base text-secondary'>{description}</p>
      <p className='text-sm sm:text-base'>
        <span className='underline'>Status</span> : <span className={`${color}`}>{status}</span>
      </p>
      {reward && (
        <p className='text-sm sm:text-base'>
          <span className='italic text-gray-500'>Reward</span> : {reward}
        </p>
      )}
      {user.id === userId && (
        <>
          <p className='text-sm sm:text-base'>
            <span className=''>Intervention Date</span> : {moment(interventionDate).format('ll')}
          </p>
          <p className='text-sm sm:text-base'>
            <span className=''>Intervention Type</span> :{' '}
            <span className='font-semibold'>{interventionType}</span>
          </p>
          <p className='text-sm sm:text-base'>
            <span className=''>Intervention Address</span> : {interventionAddressId}
          </p>
        </>
      )}
    </div>
  );
};
export default HelpRequestDetails;
