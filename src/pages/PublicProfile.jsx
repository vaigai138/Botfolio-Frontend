import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import {
    FaPhone,
    FaEnvelope,
    FaInstagram,
    FaYoutube,
    FaPen
} from 'react-icons/fa';
import { HiOutlinePhotograph } from 'react-icons/hi';
//import LenisScrollWrapper from '../components/LenisScrollWrapper';

const PublicProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`/api/users/${username}`);
                setProfile(res.data);
            } catch (err) {
                console.error('Failed to fetch public profile:', err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        const fetchLoggedInUser = async () => {
            try {
                const res = await axios.get(`/api/users/me`); // Protected route
                setLoggedInUser(res.data);
                // console.log(res.data);
            } catch (err) {
                console.warn("Not logged in or failed to fetch self:", err);
                setLoggedInUser(null);
            }
        };

        fetchProfile();
        fetchLoggedInUser();
    }, [username]);

    const isOwner = loggedInUser?.username?.toLowerCase() === profile?.username?.toLowerCase();



    const getEmbedLink = (link, isImage = false) => {
        if (link.startsWith('data:image')) return link;
        if (link.includes('drive.usercontent.google.com')) return link;

        if (link.includes('drive.google.com')) {
            const match = link.match(/\/file\/d\/(.*?)\//);
            if (match && match[1]) {
                const fileId = match[1];
                return isImage
                    ? `https://drive.google.com/uc?export=view&id=${fileId}`
                    : `https://drive.google.com/file/d/${fileId}/preview`;
            }
        }

        return link;
    };

    if (loading) return <div className="min-h-screen p-10 text-center">Loading profile...</div>;
    if (!profile) return <div className="min-h-screen p-10 text-center text-red-600">Profile not found or is private.</div>;

    const isVideoEditor = profile.role === 'video' || profile.role === 'both';
    const isGraphicsDesigner = profile.role === 'graphics' || profile.role === 'both';


    // Determine if plan is expired (based on 30-day limit)
const planExpired = (() => {
  if (!profile.plan?.purchasedAt || profile.plan?.name === 'free') return true;
  const purchasedDate = new Date(profile.plan.purchasedAt);
  const now = new Date();
  const diffInDays = Math.floor((now - purchasedDate) / (1000 * 60 * 60 * 24));
  return diffInDays >= 30;
})();

// Limit to 5 items if plan expired
const limitedShortVideos = planExpired ? profile.shortVideos.slice(0, 5) : profile.shortVideos;
const limitedLongVideos = planExpired ? profile.longVideos.slice(0, 5) : profile.longVideos;
const limitedImages = planExpired ? profile.graphicImages.slice(0, 5) : profile.graphicImages;





    const openImageSafely = (url) => {
        if (url.startsWith('data:image')) {
            // Convert base64 to blob and open
            const base64Data = url.split(',')[1];
            const contentType = url.substring(url.indexOf(":") + 1, url.indexOf(";"));
            const byteCharacters = atob(base64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } else {
            window.open(url, '_blank');
        }
    };


    return (
        //<LenisScrollWrapper>
        <div className="min-h-screen p-6 max-w-6xl mx-auto" >
            <h1 className="text-3xl font-bold mb-8 text-center">
                Welcome to {profile.name}'s Portfolio
            </h1>

            {/* Profile Box */}
            <div className="bg-white shadow-sm border border-gray-200 p-6 md:flex items-start gap-6 mb-10">
                {/* Profile Image */}
                {/* Profile Image */}
                {/* Profile Image */}
                {profile.profileImage ? (
                    <img
                        src={profile.profileImage}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border cursor-pointer"
                        onClick={() => openImageSafely(profile.profileImage)}
                    />
                ) : (
                    <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-full text-4xl text-gray-400">
                        <HiOutlinePhotograph />
                    </div>
                )}



                {/* Info */}
                <div className="flex-1 space-y-3 mt-4 md:mt-0">
                    <div>
                        <p className="text-2xl font-bold flex items-center gap-2">
                            {profile.name}

                            {/* Plan Badge */}
                            {profile.plan?.name !== 'free' && (
                                <span
                                    className={`text-xs px-2 py-1 rounded-full font-semibold ${profile.plan.name === 'standard'
                                            ? 'bg-yellow-500 text-white'
                                            : profile.plan.name === 'premium'
                                                ? 'bg-blue-500 text-white'
                                                : 'hidden'
                                        }`}
                                >
                                    {profile.plan.name} user
                                </span>
                            )}
                        </p>
                        <p className="text-sm text-gray-500">@{profile.username}</p>

                        {profile.email && (
                            <p className="text-sm text-gray-500">{profile.email}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {profile.tags?.map((tag, i) => (
                            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Socials */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                        {profile.instagram && (
                            <p className="flex items-center gap-2">
                                <FaInstagram className="text-pink-500" />
                                <a href={profile.instagram} target="_blank" rel="noreferrer" className="underline">
                                    Instagram
                                </a>
                            </p>
                        )}
                        {profile.youtube && (
                            <p className="flex items-center gap-2">
                                <FaYoutube className="text-red-500" />
                                <a href={profile.youtube} target="_blank" rel="noreferrer" className="underline">
                                    YouTube
                                </a>
                            </p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        {profile.email && (
                            <a
                                href={`mailto:${profile.email}`}
                                className="bg-[#F4A100] text-white px-4 py-2 text-sm font-medium"
                            >
                                Contact Me
                            </a>
                        )}
                        {profile.phone && (
                            <a
                                href={`tel:${profile.phone}`}
                                className="bg-[#F4A100] text-white px-4 py-2 text-sm font-medium"
                            >
                                Phone
                            </a>
                        )}
                        {isOwner && (
                            <button
                                onClick={() => navigate('/edit-profile')}
                                className="border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FaPen className="text-[#F4A100]" /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>


            

            {/* Short Videos */}
            {isVideoEditor && (
                <>
                    <h2 className="text-2xl font-bold mt-10 mb-4">🎬 Short Videos </h2>
                    {profile.shortVideos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {limitedShortVideos.map((link, i) => (

                                <div key={i} className="w-full aspect-[9/16] shadow overflow-hidden">
                                    <iframe
                                        src={getEmbedLink(link)}
                                        className="w-full h-full"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No short videos uploaded.</p>
                    )}
                </>
            )}

            {/* Long Videos */}
            {isVideoEditor && (
                <>
                    <h2 className="text-2xl font-bold mt-10 mb-4">🎥 Long Videos</h2>
                    {profile.longVideos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {limitedLongVideos.map((link, i) => (

                                <div key={i} className="w-full aspect-video shadow overflow-hidden">
                                    <iframe
                                        src={getEmbedLink(link)}
                                        className="w-full h-full"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No long videos uploaded.</p>
                    )}
                </>
            )}

            {/* Designs */}
            {/* Designs */}
            {/* Designs */}
            {isGraphicsDesigner && (
                <>
                    <h2 className="text-2xl font-bold mt-10 mb-4">🎨 Design Portfolio</h2>
                    {profile.graphicImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           {limitedImages.map((imgUrl, index) => (

                                <img
                                    key={index}
                                    src={imgUrl}
                                    alt={`design-${index}`}
                                    className="w-full aspect-square object-cover shadow cursor-pointer hover:scale-105 transition"
                                    onClick={() => openImageSafely(imgUrl)}

                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No designs uploaded yet.</p>
                    )}
                </>
            )}



            {/* Image Modal */}

        </div>
      //  </LenisScrollWrapper>
    );
};

export default PublicProfile;
