
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as userService from '../../services/userService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

const UserForm = ({ onUserCreated }: { onUserCreated: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await userService.createUser(form, localStorage.getItem('token')!);
      setForm({ email: '', name: '', password: '', role: 'user' });
      onUserCreated();
      toast({
        title: "Success",
        description: "User created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email address"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter password"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={form.role} onValueChange={(value) => setForm({ ...form, role: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
};

export default UserForm;
