import React, { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaTrashAlt } from 'react-icons/fa';
import LenisScrollWrapper from '../components/LenisScrollWrapper';

const UpdateProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();



  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    profileImage: '',
    instagram: '',
    youtube: '',
    tags: [''],
    showEmail: true,
    showPhone: true,
    role: 'video_editor',
    shortsLinks: [''],
    longsLinks: ['']
  });

  const [designImages, setDesignImages] = useState([]);
  const [existingDesignImages, setExistingDesignImages] = useState([]);
  const [profilePreview, setProfilePreview] = useState(null);
  const [planExpired, setPlanExpired] = useState(false);
  const [profileImageRemoved, setProfileImageRemoved] = useState(false);



  const [planLimits, setPlanLimits] = useState({
    shorts: 5,
    longs: 5,
    designs: 5
  });

  const [planName, setPlanName] = useState('FREE');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = res.data; // ✅ FIXED: user is the entire res.data

        // ✅ Plan Expiry Check
        let planExpired = false;
        if (user.plan && user.plan.purchasedAt) {
          const purchasedAt = new Date(user.plan.purchasedAt);
          const now = new Date();
          const planDuration = 30 * 24 * 60 * 60 * 1000; // 30 days
          planExpired = now - purchasedAt > planDuration;
        }
        setPlanExpired(planExpired);

        // ✅ Plan Details
        if (user.plan) {
          const { name, linksAllowed, designLimit } = user.plan;
          setPlanName(name?.toUpperCase() || 'FREE');
          setPlanLimits({
            shorts: linksAllowed ?? 5,
            longs: linksAllowed ?? 5,
            designs: designLimit ?? 5
          });
        }

        // ✅ Form Data
        setForm({
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          profileImage: user.profileImage || '',
          instagram: user.instagram || '',
          youtube: user.youtube || '',
          tags: user.tags || [''],
          showEmail: user.showEmail ?? true,
          showPhone: user.showPhone ?? true,
          role:
            user.portfolioType === 'video'
              ? 'video_editor'
              : user.portfolioType === 'graphics'
                ? 'designer'
                : 'both',
          shortsLinks: user.shortVideos || [''],
          longsLinks: user.longVideos || ['']
        });

        setProfilePreview(user.profileImage || null);

        if (user.graphicImages) {
          setExistingDesignImages(user.graphicImages);
        }

      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    fetchProfile();
  }, [token]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleArrayChange = (e, field, index) => {
    const updated = [...form[field]];
    updated[index] = e.target.value;
    setForm({ ...form, [field]: updated });
  };

  const addField = (field) => {
    const limit = field === 'shortsLinks' ? planLimits.shorts
      : field === 'longsLinks' ? planLimits.longs
        : 0;

    if (form[field].length < limit) {
      setForm({ ...form, [field]: [...form[field], ''] });
    } else {
      alert(`You've reached the limit of ${limit} for ${field}.`);
    }
  };



  const removeField = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm({ ...form, [field]: updated });
  };

  const handleDesignImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (less than 1MB)
    if (file.size > 1024 * 1024) {
      alert('Image must be less than 1MB');
      return;
    }

    // Check total image count (new + existing)
    if (designImages.length + existingDesignImages.length >= planLimits.shorts) {
      alert(`You can upload a maximum of ${planLimits.shorts} design images in the ${planName} plan.`);
      return;
    }

    //console.log('Design limit:', planLimits.shorts);
   // console.log('Current count:', designImages.length + existingDesignImages.length);



    setDesignImages([...designImages, file]);
  };


  const removeDesignImage = (index) => {
    const updated = [...designImages];
    updated.splice(index, 1);
    setDesignImages(updated);
  };

  const removeExistingDesignImage = (index) => {
    const updated = [...existingDesignImages];
    updated.splice(index, 1);
    setExistingDesignImages(updated);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit: 1MB)
    if (file.size <= 1 * 1024 * 1024) {
      setForm({ ...form, profileImage: file });
      setProfilePreview(URL.createObjectURL(file));
    } else {
      alert(`${file.name} is too large. Max 1MB allowed.`);
    }
  };


  const removeProfileImage = () => {
    setForm({ ...form, profileImage: '' });
    setProfilePreview(null);
    setProfileImageRemoved(true); // <== tell backend to delete it
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('username', form.username);
    payload.append('email', form.email);
    payload.append('phone', form.phone);
    payload.append('instagram', form.instagram);
    payload.append('youtube', form.youtube);
    payload.append('showEmail', form.showEmail);
    payload.append('showPhone', form.showPhone);
    payload.append(
      'portfolioType',
      form.role === 'video_editor' ? 'video' : form.role === 'designer' ? 'graphics' : 'both'
    );


    if (form.profileImage && typeof form.profileImage !== 'string') {
      payload.append('profileImage', form.profileImage);
    }

    if (profileImageRemoved) {
      payload.append('removeProfileImage', 'true');
    }


    form.tags.filter((t) => t.trim()).forEach((tag) => payload.append('tags[]', tag));
    form.shortsLinks.filter((l) => l.trim()).forEach((link) => payload.append('shortVideos[]', link));
    form.longsLinks.filter((l) => l.trim()).forEach((link) => payload.append('longVideos[]', link));
    designImages.forEach((img) => {
      payload.append('designImages', img);
    });
    existingDesignImages.forEach((url) => {
      payload.append('existingDesignImages[]', url);
    });

    try {
      await axios.put('/api/users/profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated!');
      navigate(`/${form.username}`);
    } catch (err) {
      console.error(err.response?.data || err);
      alert('Update failed!');
    }
  };

  return (
    <LenisScrollWrapper>
    <div className="max-w-5xl mx-auto mt-10 p-8 bg-white shadow-xl border border-gray-200">

      {planExpired && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4 text-sm border border-yellow-300">
          🚨 Your plan has expired. You can add links as per your plan, but only <b>5 videos and images</b> will be visible. Upgrade to <b>Pro</b> to unlock all features!
        </div>
      )}


      <p className="text-sm text-gray-500 mb-4">
        Current Plan: <strong>{planName}</strong>
      </p>

      <div className="flex items-center gap-4 mb-6">
        <FaUserCircle className="text-6xl text-gray-400" />
        <h2 className="text-3xl font-bold text-gray-800">Update Your Public Profile</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Profile Image */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Profile Image</h3>
          {profilePreview && (
            <div className="relative inline-block">
              <img src={profilePreview} alt="Preview" className="w-32 h-32 rounded-full shadow" />
              <button type="button" onClick={removeProfileImage} className="absolute top-0 right-0 bg-white p-1 rounded-full text-red-600">
                <FaTrashAlt />
              </button>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleProfileImageChange} className="mt-2 input" />
        </div>

        {/* Personal Details */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="input" />
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="input" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />
          </div>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram URL" className="input" />
            <input name="youtube" value={form.youtube} onChange={handleChange} placeholder="YouTube Channel URL" className="input" />
          </div>
        </div>

        {/* Tags / Skills */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Skills / Tags</h3>
          {form.tags.map((tag, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={tag} onChange={(e) => handleArrayChange(e, 'tags', i)} className="input flex-1" />
              <button type="button" onClick={() => removeField('tags', i)} className="text-red-600"><FaTrashAlt /></button>
            </div>
          ))}
          <button type="button" onClick={() => addField('tags')} className="text-blue-500 underline mt-1">+ Add Tag</button>
        </div>

        {/* Visibility */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="showEmail" checked={form.showEmail} onChange={handleChange} />
            Show Email
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="showPhone" checked={form.showPhone} onChange={handleChange} />
            Show Phone
          </label>
        </div>

        {/* Role */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Your Role</h3>
          <select name="role" value={form.role} onChange={handleChange} className="input">
            <option value="video_editor">Video Editor</option>
            <option value="designer">Graphics Designer</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Videos */}
        {['shortsLinks', 'longsLinks'].map((field) => (
          <div key={field}>
            <h3 className="text-xl font-semibold mb-3">
              {field === 'shortsLinks' ? 'Shorts (9:16)' : 'Long Videos (16:9)'}
            </h3>

            {form[field].map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={link}
                  onChange={(e) => handleArrayChange(e, field, index)}
                  placeholder={`Paste ${field === 'shortsLinks' ? 'Short' : 'Long'} video link`}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeField(field, index)}
                  className="text-red-600"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}

            {form[field].length < planLimits[field === 'shortsLinks' ? 'shorts' : 'longs'] ? (
              <button
                type="button"
                onClick={() => addField(field)}
                className="text-blue-500 underline mt-1"
              >
                + Add More
              </button>
            ) : (
              <p className="text-sm text-yellow-600 mt-2">
                Reached max limit for {planName} plan.{' '}
                <button onClick={() => navigate('/pricing')} type="button" className="text-blue-600 underline ml-1">
                  Upgrade to Pro
                </button>
              </p>
            )}
          </div>
        ))}


        {/* Design Uploads */}
        <div>
          <h3 className="text-xl font-semibold mb-3">
            Design Uploads (max {planLimits.shorts} images, &lt;1MB each)
          </h3>

          <input type="file" accept="image/*" onChange={handleDesignImageChange} className="input" />
          <div className="flex flex-wrap gap-4 mt-4">
            {existingDesignImages.map((url, index) => (
              <div key={`exist-${index}`} className="relative">
                <img src={url} alt={`Existing ${index}`} className="w-32 h-32 object-cover rounded-lg shadow" />
                <button type="button" onClick={() => removeExistingDesignImage(index)} className="absolute top-0 right-0 bg-white text-red-600 p-1 rounded-full">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            {designImages.map((img, index) => (
              <div key={`new-${index}`} className="relative">
                <img src={URL.createObjectURL(img)} alt={`Design ${index}`} className="w-32 h-32 object-cover rounded-lg shadow" />
                <button type="button" onClick={() => removeDesignImage(index)} className="absolute top-0 right-0 bg-white text-red-600 p-1 rounded-full">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
          {(designImages.length + existingDesignImages.length) >= planLimits.shorts && (
            <p className="text-sm text-yellow-600 mt-2">
              Reached max limit for {planName} plan.{' '}
              <button onClick={() => navigate('/pricing')} type="button" className="text-blue-600 underline ml-1">
                Upgrade to Pro
              </button>
            </p>
          )}


        </div>

        <button
          type="submit"
          className="w-full p-3 bg-[#F4A100] text-white font-bold rounded hover:opacity-90 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
    </LenisScrollWrapper>
  );
};

export default UpdateProfile;
