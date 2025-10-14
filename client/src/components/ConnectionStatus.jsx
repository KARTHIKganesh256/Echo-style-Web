import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { localAuth } from '../utils/localAuth';
import { Badge } from '@/components/ui/badge';

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    supabase: 'checking',
    localAuth: 'checking',
    mode: 'unknown'
  });

  useEffect(() => {
    checkConnections();
  }, []);

  const checkConnections = async () => {
    // Check Supabase connection
    try {
      await supabase.from('products').select('count').limit(1);
      setStatus(prev => ({ ...prev, supabase: 'connected' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, supabase: 'disconnected' }));
    }

    // Check local auth
    try {
      const user = await localAuth.getCurrentUser();
      setStatus(prev => ({ 
        ...prev, 
        localAuth: 'ready',
        mode: prev.supabase === 'connected' ? 'online' : 'offline'
      }));
    } catch (error) {
      setStatus(prev => ({ 
        ...prev, 
        localAuth: 'ready',
        mode: prev.supabase === 'connected' ? 'online' : 'offline'
      }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
      case 'ready':
        return 'bg-green-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Online';
      case 'disconnected':
        return 'Offline';
      case 'ready':
        return 'Ready';
      default:
        return 'Checking...';
    }
  };

  if (status.mode === 'unknown') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          🔄 Checking connection...
        </Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col gap-2">
        <Badge 
          variant="outline" 
          className={`${status.mode === 'online' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
        >
          {status.mode === 'online' ? '🌐 Online Mode' : '💾 Offline Mode'}
        </Badge>
        
        {status.mode === 'offline' && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
            ✨ All features work locally
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;









