
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as communityService from '../../services/communityService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Plus, Search, MessageSquare, Users } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const CommunityList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [communities, setCommunities] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchCommunities = () => {
    if (user) {
      communityService.getCommunities(localStorage.getItem('token')!).then(setCommunities);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await communityService.createCommunity(form, localStorage.getItem('token')!);
      setForm({ name: '', description: '' });
      fetchCommunities();
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Community created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await communityService.deleteCommunity(id, localStorage.getItem('token')!);
      fetchCommunities();
      toast({
        title: "Success",
        description: "Community deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (c: any) => setEditing(c);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await communityService.updateCommunity(editing.id, editing, localStorage.getItem('token')!);
      setEditing(null);
      fetchCommunities();
      toast({
        title: "Success",
        description: "Community updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update community",
        variant: "destructive",
      });
    }
  };

  const filteredCommunities = communities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {user?.role === 'admin' && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Community
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Community Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter community name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Enter community description"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Community</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Communities Grid */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No communities found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first community'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCommunities.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        Community
                      </Badge>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Community</DialogTitle>
                          </DialogHeader>
                          {editing && editing.id === c.id && (
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Community Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editing.name}
                                  onChange={e => setEditing({ ...editing, name: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Textarea
                                  id="edit-description"
                                  value={editing.description}
                                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                                  className="min-h-[100px]"
                                />
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
                      <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {c.description || 'No description available'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityList;
