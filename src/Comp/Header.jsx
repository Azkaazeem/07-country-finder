import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Camera, LogOut, X, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && data) setProfile(data);
  };

  const handleLogout = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await supabase.auth.signOut();
        navigate('/');
        Swal.fire('Logged Out', 'You have been successfully logged out.', 'success');
      }
    });
  };

  const handleUpdateImage = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: newUrl }).eq('id', user.id);
      if (updateError) throw updateError;
      
      setProfile({ ...profile, avatar_url: newUrl });
      setIsModalOpen(false);
      
      Swal.fire({ title: 'Updated!', text: 'Your profile picture has been updated.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire('Update Failed', error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800 py-4 sticky top-0 z-40 transition-colors duration-500">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-80 transition-opacity tracking-tight">
            Global Finder
          </Link>

          <div className="flex items-center gap-5">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-4 animate-fade-in">
                <div 
                  className="relative cursor-pointer group rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 hover:scale-105 transition-transform duration-300" 
                  onClick={() => setIsModalOpen(true)}
                  title="Update Profile Picture"
                >
                  <img 
                    src={profile?.avatar_url || 'https://via.placeholder.com/150'} 
                    alt="User Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-900"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>

                <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300" title="Log Out">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="px-5 py-2.5 bg-gray-900 dark:bg-blue-600 text-white font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Profile Image Modal */}
      {isModalOpen && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl max-w-sm w-full relative shadow-2xl transform transition-all scale-100">
            
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Profile Picture</h3>
            
            <div className="w-40 h-40 mx-auto mb-8 relative rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-inner group">
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
              ) : (
                <img src={profile.avatar_url || 'https://via.placeholder.com/150'} alt="Profile Large" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
            </div>

            <label className="block w-full text-center py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg active:scale-95">
              {uploading ? 'Updating...' : 'Upload New Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpdateImage} disabled={uploading} />
            </label>
          </div>
        </div>
      )}
    </>
  );
}