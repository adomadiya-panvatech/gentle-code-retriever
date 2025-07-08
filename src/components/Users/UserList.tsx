
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import UserForm from './UserForm';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Trash2, Edit, UserX, Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const UserList = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // const fetchUsers = () => {
  //   if (user) {
  //     userService.getUsers(localStorage.getItem('token')!).then(setUsers);
  //   }
  // };

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await userService.getUsers(token, currentPage, itemsPerPage);
      setUsers(response.data || response);
      setTotalPages(Math.ceil((response.total || response.length) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
      
      // Fallback to mock data
      const fakeUsers = [
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'user',
          banned: false,
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'admin',
          banned: false,
        },
        {
          id: '3',
          name: 'Charlie Davis',
          email: 'charlie@example.com',
          role: 'user',
          banned: true,
        },
      ];
      setUsers(fakeUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, token]);

  // const handleDelete = async (id: string) => {
  //   try {
  //     await userService.deleteUser(id, localStorage.getItem('token')!);
  //     fetchUsers();
  //     toast({
  //       title: "Success",
  //       description: "User deleted successfully",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to delete user",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleEdit = (u: any) => setEditing(u);

  // const handleEditSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await userService.updateUser(editing.id, editing, localStorage.getItem('token')!);
  //     setEditing(null);
  //     fetchUsers();
  //     toast({
  //       title: "Success",
  //       description: "User updated successfully",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to update user",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const handleBan = async (id: string) => {
  //   try {
  //     await userService.banUser(id, localStorage.getItem('token')!);
  //     fetchUsers();
  //     toast({
  //       title: "Success",
  //       description: "User banned successfully",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to ban user",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handleDelete = async (id: string) => {
    try {
      // await userService.deleteUser(id, localStorage.getItem('token')!);

      // Remove user locally
      setUsers(prev => prev.filter(user => user.id !== id));

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // await userService.updateUser(editing.id, editing, localStorage.getItem('token')!);

      setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
      setEditing(null);

      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleBan = async (id: string) => {
    try {
      // await userService.banUser(id, localStorage.getItem('token')!);

      setUsers(prev =>
        prev.map(user => user.id === id ? { ...user, banned: true } : user)
      );

      toast({
        title: "Success",
        description: "User banned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to ban user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <div className="text-center py-8 text-muted-foreground">Login required</div>;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm onUserCreated={() => {
              fetchUsers();
              setShowCreateForm(false);
            }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Users ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.banned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(u)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            {editing && editing.id === u.id && (
                              <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="name">Name</Label>
                                  <Input
                                    id="name"
                                    value={editing.name}
                                    onChange={e => setEditing({ ...editing, name: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="role">Role</Label>
                                  <Select
                                    value={editing.role}
                                    onValueChange={value => setEditing({ ...editing, role: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="user">User</SelectItem>
                                      <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2">
                                  <Button type="submit">Save Changes</Button>
                                  <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>

                        {user?.role === 'admin' && u.role !== 'admin' && !u.banned && (
                          <Button variant="outline" size="sm" onClick={() => handleBan(u.id)}>
                            <UserX className="h-4 w-4" />
                          </Button>
                        )}

                        <Button variant="outline" size="sm" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserList;
