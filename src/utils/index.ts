import { AIMessage, Message } from '@prisma/client';
import moment from 'moment';

export const getFullNames = (user: any) => {
  if (!user) {
    return '';
  }
  return [user.firstname, user.lastname]
    .filter(Boolean)
    .map((name) => name[0].toUpperCase() + name.slice(1))
    .join(' ');
};

export const shouldDisplayTime = (
  currentMessage: Message | AIMessage,
  nextMessage: Message | AIMessage | null
) => {
  if (!nextMessage) {
    return true;
  }
  return moment(nextMessage.sendDate).diff(currentMessage.sendDate, 'minutes') > 60;
};

export const shouldDisplayDate = (
  currentMessage: Message | AIMessage,
  nextMessage: Message | AIMessage | null
) => {
  if (!nextMessage) {
    return false;
  }
  return (
    !moment(currentMessage.sendDate).isSame(nextMessage.sendDate, 'day') &&
    moment(nextMessage.sendDate).diff(currentMessage.sendDate, 'minutes') > 30
  );
};

export const formatAddress = (address: {
  city: string;
  country: string;
  postalCode: string;
  street: string;
}) => {
  const { city, country, postalCode, street } = address;
  return [street, city, postalCode, country].filter(Boolean).join(', ');
};
