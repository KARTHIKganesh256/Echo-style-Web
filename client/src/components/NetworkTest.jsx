import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const NetworkTest = () => {
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const runTests = async () => {
      const results = {};

      // Test 1: Basic fetch to Supabase
      try {
        const response = await fetch('https://fcujblneuxjtvxxafyne.supabase.co/rest/v1/', {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          }
        });
        results.supabaseFetch = response.ok ? '✅ Success' : `❌ HTTP ${response.status}`;
      } catch (error) {
        results.supabaseFetch = `❌ ${error.message}`;
      }

      // Test 2: Supabase client test
      try {
        const { data, error } = await supabase.from('products').select('count');
        results.supabaseClient = error ? `❌ ${error.message}` : '✅ Success';
      } catch (error) {
        results.supabaseClient = `❌ ${error.message}`;
      }

      // Test 3: General internet test
      try {
        const response = await fetch('https://httpbin.org/status/200');
        results.internet = response.ok ? '✅ Success' : `❌ HTTP ${response.status}`;
      } catch (error) {
        results.internet = `❌ ${error.message}`;
      }

      setTestResults(results);
    };

    runTests();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">🌐 Network Test Results</h3>
      <div className="space-y-1 text-sm">
        <div>Internet: {testResults.internet || '⏳ Testing...'}</div>
        <div>Supabase Fetch: {testResults.supabaseFetch || '⏳ Testing...'}</div>
        <div>Supabase Client: {testResults.supabaseClient || '⏳ Testing...'}</div>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Retry Tests
      </button>
    </div>
  );
};

export default NetworkTest;







