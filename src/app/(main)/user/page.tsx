'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@nextui-org/react';
import { updateProfile } from '@/lib/redux/slices/user'; 

export default function EditProfile() {
  const userReducer = useSelector((state: any) => state.user);
  const { user } = userReducer || {};
  const dispatch: any = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        age: user.age || '',
        password: '', 
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ id: user.id, ...formData }));
    router.push('/'); 
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Card className="w-full max-w-lg p-4">
        <h2 className="text-lg font-bold text-center mb-4">Edit Profile</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Input
            clearable
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="Age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Leave empty to keep current password"
          />
          <Button type="submit" className="bg-primary text-white">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
