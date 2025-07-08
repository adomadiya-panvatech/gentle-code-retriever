import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Eye, Edit3, Link as LinkIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCollectionForm from '../components/Content/ContentCollectionForm';
import ViewModal from '../components/Modals/ViewModal';
import { useAuth } from '../context/AuthContext';
import { contentCollectionService } from '../services/contentCollectionService';
import { useToast } from '../hooks/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';

const ContentCollections = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [viewingCollection, setViewingCollection] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCollections();
  }, [currentPage, token]);

  const fetchCollections = async () => {
    if (!token) {
      // Use mock data when no token
      const filtered = mockCollections.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalMockItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      setCollections(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      return;
    }

    setLoading(true);
    try {
      const response = await contentCollectionService.getContentCollections(token);
      const allCollections = response.data || response;
      const filtered = allCollections.filter((collection: any) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      setCollections(paginatedData);
      setTotalPages(Math.ceil(totalItems / itemsPerPage));
    } catch (error) {
      console.error('Error fetching content collections:', error);
      // Fallback to mock data
      const filtered = mockCollections.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const totalMockItems = filtered.length;
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      setCollections(paginatedData);
      setTotalPages(Math.ceil(totalMockItems / itemsPerPage));
      
      toast({
        title: "Error",
        description: "Failed to load content collections, showing sample data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const mockCollections = [
    {
      id: 1,
      name: "'Tis the Season",
      description: "Find comfort and joy this holiday season with holiday tips, articles, and recipes.",
      content: 13,
      taxonomies: "none",
      activities: "none",
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 2,
      name: "Add fruit to cereal or yogurt",
      description: "Fruit is a fun way to mix up your cereal or yogurt, while also boosting your micronutrient intake. Berries, bananas, kiwi, or pomegranate are just a few tasty options.",
      content: 9,
      taxonomies: "none",
      activities: 1,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 3,
      name: "Add healthy fats to salads/sandwiches",
      description: "Sandwiches and salads are a great place to add in more healthy fats to your diet. Avocado, nuts, or seeds are all tasty options.",
      content: 10,
      taxonomies: "none",
      activities: 1,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 4,
      name: "Add no salt to my food",
      description: "Salt is found in a number of the foods we eat each day without even knowing it. High salt intake can increase blood pressure, increasing your risk of heart disease. The average person consumes above the daily recommended value of salt each day. Not adding salt to your food is one step to reduce the amount of salt you eat.",
      content: 10,
      taxonomies: "none",
      activities: 1,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 5,
      name: "Aerobics",
      description: "Aerobics uses rhythmic exercises, paired with flexibility and light strength training, to give you a fun cardiovascular workout. It can be done in a group setting, or alone.",
      content: 5,
      taxonomies: "none",
      activities: 1,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 6,
      name: "Wellness Journey",
      description: "A comprehensive wellness journey focusing on mental and physical health.",
      content: 15,
      taxonomies: "health",
      activities: 3,
      private: "Public",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 7,
      name: "Mindful Eating",
      description: "Learn to eat mindfully and develop a healthy relationship with food.",
      content: 8,
      taxonomies: "nutrition",
      activities: 2,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 8,
      name: "Stress Management",
      description: "Effective techniques for managing daily stress and anxiety.",
      content: 12,
      taxonomies: "mental-health",
      activities: 4,
      private: "Public",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 9,
      name: "Exercise Fundamentals",
      description: "Basic exercises and routines for beginners to start their fitness journey.",
      content: 20,
      taxonomies: "fitness",
      activities: 5,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 10,
      name: "Sleep Optimization",
      description: "Tips and strategies for improving sleep quality and duration.",
      content: 7,
      taxonomies: "sleep",
      activities: 2,
      private: "Public",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 11,
      name: "Healthy Habits",
      description: "Building sustainable healthy habits for long-term wellness.",
      content: 14,
      taxonomies: "lifestyle",
      activities: 3,
      private: "Private",
      image: "/lovable-uploads/placeholder-image.jpg"
    },
    {
      id: 12,
      name: "Work-Life Balance",
      description: "Strategies for maintaining balance between professional and personal life.",
      content: 11,
      taxonomies: "balance",
      activities: 4,
      private: "Public",
      image: "/lovable-uploads/placeholder-image.jpg"
    }
  ];

  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    setShowForm(true);
  };

  const handleView = (collection: any) => {
    setViewingCollection(collection);
    setShowViewModal(true);
  };

  const handleAdd = () => {
    setEditingCollection(null);
    setShowForm(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Re-fetch when search term changes
  useEffect(() => {
    fetchCollections();
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Content Collections</h1>
        <Button 
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-80">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search collections..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">Loading collections...</div>
        ) : collections.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            {searchTerm ? `No collections found matching "${searchTerm}"` : 'No collections found'}
          </div>
        ) : (
          collections.map((collection) => (
            <Card key={collection.id} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {collection.image && (
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}
                  <h3 className="font-semibold text-lg text-gray-900">{collection.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{collection.description}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{collection.content} content items</span>
                    <Badge variant="outline">{collection.private}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleView(collection)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEdit(collection)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ContentCollectionForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCollection(null);
        }}
        collection={editingCollection}
      />

      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingCollection(null);
        }}
        title="View Collection"
        data={viewingCollection}
        type="collection"
      />
    </div>
  );
};

export default ContentCollections;
