
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../../hooks/use-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (err) {
      setError('Invalid credentials');
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200" 
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button type="button" className="font-medium text-primary hover:underline">
            Create one
          </button>
        </p>
      </div>
    </form>
  );
};

export default Login;
