import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Mail, Lock, User, UploadCloud, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ThemeToggle from '../Comp/ThemeToggle';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  const navigate = useNavigate();

  const handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(publicUrlData.publicUrl);
    } catch (error) {
      Swal.fire('Upload Failed', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        Swal.fire({
          title: 'Welcome Back!',
          text: 'You have successfully logged in.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        if (data.user) {
          await supabase.from('profiles').insert([
            { id: data.user.id, full_name: name, avatar_url: avatarUrl }
          ]);
        }
        
        Swal.fire({
          title: 'Account Created',
          text: 'Registration successful. Please log in.',
          icon: 'success'
        });
        setIsLogin(true);
      }
    } catch (error) {
      Swal.fire('Authentication Error', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 transition-all duration-500 animate-fade-in hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)]">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8 tracking-tight">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col items-center justify-center">
                <label className="relative group cursor-pointer flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-700/50 overflow-hidden transition-all duration-300 hover:scale-105 shadow-sm">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  ) : avatarUrl ? (
                    <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">Upload Profile Picture</span>
              </div>

              <div className="relative group">
                <User className="absolute inset-y-0 left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input type="text" required placeholder="Full Name" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute inset-y-0 left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="email" required placeholder="Email Address" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="relative group">
            <Lock className="absolute inset-y-0 left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input type="password" required placeholder="Password" className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" disabled={loading || uploading} className="w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform active:scale-95 flex justify-center items-center shadow-md hover:shadow-lg disabled:opacity-70">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm font-medium">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}