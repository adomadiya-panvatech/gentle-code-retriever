
import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Minus } from 'lucide-react';

const CommunityModeration = () => {
  const [activeTab, setActiveTab] = useState('for-review');

  const mockModerationItem = {
    date: '8/21/22',
    time: '8:09 PM',
    flags: 1,
    content: {
      title: 'Share with the Community',
      text: "It's been a little over a week since I started trying to be more consistent with my bedtime like Dr. Ruci recommended. It's still kinda hard to stop watching TV and get myself into bed 😞, but I think I'm noticing a difference? Getting up Monday morning was def a bit easier. 🎉🔥🙌",
      image: '/placeholder-community-post.jpg'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Community Moderation</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="for-review">For review</TabsTrigger>
          <TabsTrigger value="blocked">Blocked</TabsTrigger>
          <TabsTrigger value="allowed">Allowed</TabsTrigger>
        </TabsList>

        <TabsContent value="for-review" className="space-y-4">
          <Card className="border-gray-200">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900">Last updated</TableHead>
                    <TableHead className="font-semibold text-gray-900">Flags</TableHead>
                    <TableHead className="font-semibold text-gray-900">Content</TableHead>
                    <TableHead className="font-semibold text-gray-900">Flagged Item</TableHead>
                    <TableHead className="font-semibold text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-gray-100">
                    <TableCell>
                      <div>
                        <div>{mockModerationItem.date}</div>
                        <div>{mockModerationItem.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{mockModerationItem.flags}</TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <div className="bg-blue-500 text-white p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">{mockModerationItem.content.title}</h3>
                          <p className="text-sm mb-3">{mockModerationItem.content.text}</p>
                          <img 
                            src={mockModerationItem.content.image} 
                            alt="Community post"
                            className="w-full h-32 object-cover rounded"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500">-</span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="rounded-full w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blocked">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No blocked content</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allowed">
          <Card className="border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No allowed content</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityModeration;
