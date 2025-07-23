import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logoutUser } = useAuth();

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold">Botfolio</h1>

      {user ? (
        <div className="flex items-center space-x-4">
          <div
            className="w-10 h-10 rounded-full bg-[#F4A100] text-white flex items-center justify-center font-bold cursor-pointer"
            title={user.name}
          >
            {user.name[0].toUpperCase()}
          </div>
          <button onClick={logoutUser} className="text-sm text-gray-600 hover:underline">
            Logout
          </button>
        </div>
      ) : (
        <div className="space-x-4">
          <a href="/login" className="text-sm text-gray-600 hover:underline">Login</a>
          <a href="/get-started" className="bg-[#F4A100] text-white px-4 py-2 rounded">Get Started</a>
        </div>
      )}
    </header>
  );
};
