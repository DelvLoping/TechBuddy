'use client';

import { Button, Input, Textarea, Select, SelectItem, Card } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/spinner';
import { useDispatch, useSelector } from 'react-redux';
import { OPEN, VIRTUAL, IN_PERSON } from '@/constant';
import axios from 'axios';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/navigation';
import { reloadHelpRequests } from '@/lib/redux/slices/helpRequests';
import moment from 'moment';

type HelpRequestProps = {
  id: string;
  idHelpRequest?: string;
};
export default function HelpRequest({ id, idHelpRequest }: HelpRequestProps) {
  const isEdit = !!idHelpRequest;
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.user);
  const { loading } = userReducer || {};
  const [error, setError] = useState('');
  const router = useRouter();
  const [formData, setFormData] = useState({
    subject: undefined,
    description: undefined,
    interventionType: VIRTUAL,
    interventionDate: undefined,
    reward: undefined,
    interventionAddress: {
      street: undefined,
      city: undefined,
      postalCode: undefined,
      country: undefined
    },
    status: OPEN
  });

  useEffect(() => {
    if (isEdit && idHelpRequest) {
      axiosInstance
        .get(`/help-request/${idHelpRequest}`)
        .then((res) => {
          const helpRequest = res.data.helpRequest;
          helpRequest.interventionType = helpRequest.interventionType || VIRTUAL;
          helpRequest.interventionDate = moment(helpRequest.interventionDate).format('YYYY-MM-DD');
          setFormData(helpRequest);
        })
        .catch((error: any) => {
          if (axios.isAxiosError(error) && error.response.data) {
            setError(error.response.data.message);
          }
        });
    }
  }, [idHelpRequest]);

  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axiosInstance.put(`/help-request/${idHelpRequest}`, formData);
        setSubmissionSuccess(true);
      } else {
        await axiosInstance.post('/help-request', formData);
        setSubmissionSuccess(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response.data) {
        setError(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    if (submissionSuccess) {
      setTimeout(() => {
        dispatch(reloadHelpRequests());
        router.push('/');
      }, 5000);
    }
  }, [submissionSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      interventionAddress: { ...formData.interventionAddress, [name]: value }
    });
  };

  console.log(formData);
  return (
    <div className='w-full'>
      {error ? (
        <div className='text-danger text-center font-bold text-sm sm:text-base'>
          {error.includes('Unauthorized')
            ? 'You are not authorized to access this page.'
            : error.includes('not found')
            ? 'The help request you are trying to edit does not exist.'
            : 'An error occurred while trying to submit your help request.'}
        </div>
      ) : (
        <>
          {!submissionSuccess && (
            <form id={id} onSubmit={submit} className='w-full'>
              <div className='flex flex-col items-center justify-center gap-4 mb-4'>
                <Input
                  label='Subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  label='Description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <Select
                  label='Intervention Type'
                  name='interventionType'
                  onChange={handleChange}
                  required
                  defaultSelectedKeys={[formData.interventionType]}
                >
                  <SelectItem key={VIRTUAL} value={VIRTUAL}>
                    Virtual
                  </SelectItem>
                  <SelectItem key={IN_PERSON} value={IN_PERSON}>
                    In person
                  </SelectItem>
                </Select>

                <Input
                  label='Intervention Date'
                  type='date'
                  name='interventionDate'
                  value={formData.interventionDate}
                  onChange={handleChange}
                />
                <Input
                  label='Reward'
                  type='text'
                  name='reward'
                  value={formData.reward}
                  onChange={handleChange}
                />
                {formData.interventionType === IN_PERSON && (
                  <>
                    <h2>In person</h2>
                    <Input
                      label='Street'
                      name='street'
                      value={formData.interventionAddress.street}
                      onChange={handleAddressChange}
                    />
                    <Input
                      label='City'
                      name='city'
                      value={formData.interventionAddress.city}
                      onChange={handleAddressChange}
                    />
                    <Input
                      label='Postal Code'
                      name='postalCode'
                      value={formData.interventionAddress.postalCode}
                      onChange={handleAddressChange}
                    />
                    <Input
                      label='Country'
                      name='country'
                      value={formData.interventionAddress.country}
                      onChange={handleAddressChange}
                    />
                  </>
                )}

                <Button
                  type='submit'
                  disabled={loading}
                  className='min-w-24 w-full bg-primary text-white mt-8 font-bold'
                >
                  {loading ? <Spinner color='white' /> : 'Submit'}
                </Button>
                {error && <p className='text-danger'>{error}</p>}
              </div>
            </form>
          )}

          {submissionSuccess && (
            <div className='text-green-600 text-center font-bold mt-4'>
              {isEdit
                ? 'Your help request has been updated successfully!'
                : ' Your help request has been submitted successfully!'}
            </div>
          )}
        </>
      )}
    </div>
  );
}
