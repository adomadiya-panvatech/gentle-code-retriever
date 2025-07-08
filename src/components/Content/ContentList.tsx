
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as contentService from '../../services/contentService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Edit, Trash2, Plus, Search, FileText } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const ContentList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [content, setContent] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [editing, setEditing] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchContent = () => {
    if (user) {
      contentService.getContent(localStorage.getItem('token')!).then(setContent);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentService.createContent(form, localStorage.getItem('token')!);
      setForm({ title: '', body: '' });
      fetchContent();
      setShowCreateForm(false);
      toast({
        title: "Success",
        description: "Content created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contentService.deleteContent(id, localStorage.getItem('token')!);
      fetchContent();
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (c: any) => setEditing(c);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentService.updateContent(editing.id, editing, localStorage.getItem('token')!);
      setEditing(null);
      fetchContent();
      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive",
      });
    }
  };

  const filteredContent = content.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
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
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter content title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Content</Label>
                  <Textarea
                    id="body"
                    name="body"
                    value={form.body}
                    onChange={e => setForm({ ...form, body: e.target.value })}
                    placeholder="Enter content body"
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Content</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 md:gap-6">
        {filteredContent.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No content found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first content'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContent.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  {user?.role === 'admin' && (
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Content</DialogTitle>
                          </DialogHeader>
                          {editing && editing.id === c.id && (
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={editing.title}
                                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-body">Content</Label>
                                <Textarea
                                  id="edit-body"
                                  value={editing.body}
                                  onChange={e => setEditing({ ...editing, body: e.target.value })}
                                  className="min-h-[120px]"
                                  required
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
                <p className="text-muted-foreground leading-relaxed">{c.body}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentList;
