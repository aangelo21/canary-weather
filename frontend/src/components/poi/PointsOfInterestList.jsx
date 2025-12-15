import { useState, useEffect } from 'react';
import {
    fetchPois as fetchPoisService,
    fetchPersonalPois,
    createOrUpdatePoi,
    deletePoi as deletePoiService,
} from '../../services/poiService';
import POIForm from './POIForm';
import POICard from './POICard';
import POICardSkeleton from './POICardSkeleton';
import { useTranslation } from 'react-i18next';


export default function PointsOfInterestList() {
    const { t } = useTranslation();

    
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    
    const [isAdmin, setIsAdmin] = useState(false);

    
    const [pois, setPois] = useState([]);

    
    const [filteredPois, setFilteredPois] = useState([]);

    
    const [filter, setFilter] = useState('all');

    
    const [formData, setFormData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        description: '',
        is_global: false,
    });

    
    const [showEditForm, setShowEditForm] = useState(false);

    
    const [showEditModal, setShowEditModal] = useState(false);

    
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    
    const [editingId, setEditingId] = useState(null);

    
    const [deletingId, setDeletingId] = useState(null);

    
    const [loading, setLoading] = useState(false);

    
    const [isFiltering, setIsFiltering] = useState(true);

    
    const [error, setError] = useState('');

    
    const [selectedImage, setSelectedImage] = useState(null);

    
    const [imagePreview, setImagePreview] = useState(null);

    
    const fetchPois = async () => {
        try {
            setLoading(true);
            const data = await fetchPoisService();
            setPois(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    
    const fetchPersonalPoisData = async () => {
        try {
            const user = localStorage.getItem('cw_user');
            if (!user) return [];
            return await fetchPersonalPois();
        } catch (err) {
            console.error('Error fetching personal POIs:', err);
            return [];
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await createOrUpdatePoi(formData, editingId, selectedImage);
            resetForm();
            setShowEditForm(false);
            setShowEditModal(false);
            setEditingId(null);
            fetchPois();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    
    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    
    const confirmDelete = async () => {
        if (!deletingId) return;
        try {
            setLoading(true);
            await deletePoiService(deletingId);
            setShowDeleteModal(false);
            setDeletingId(null);
            fetchPois();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    
    const handleEdit = (poi) => {
        setFormData({
            name: poi.name,
            latitude: poi.latitude?.toString() || '',
            longitude: poi.longitude?.toString() || '',
            description: poi.description || '',
            is_global: poi.is_global,
        });
        setEditingId(poi.id);
        setShowEditModal(true);
        if (poi.image_url) {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const baseUrl = API_BASE.replace('/api', '');
            setImagePreview(`${baseUrl}${poi.image_url}`);
        } else {
            setImagePreview(null);
        }
        setSelectedImage(null);
    };

    
    const resetForm = () => {
        setFormData({
            name: '',
            latitude: '',
            longitude: '',
            description: '',
            is_global: false,
        });
        setEditingId(null);
        setSelectedImage(null);
        setImagePreview(null);
    };

    
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('cw_user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setIsAuthenticated(true);
            setIsAdmin(user.is_admin);
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
        fetchPois();

        const handleUserLogin = () => {
            const userStr = localStorage.getItem('cw_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setIsAuthenticated(true);
                setIsAdmin(user.is_admin);
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
            fetchPois();
            setFilter('all');
        };

        const handlePoiCreated = () => {
            fetchPois();
            applyFilter();
        };

        window.addEventListener('userLoggedIn', handleUserLogin);
        window.addEventListener('poiCreated', handlePoiCreated);
        return () => {
            window.removeEventListener('userLoggedIn', handleUserLogin);
            window.removeEventListener('poiCreated', handlePoiCreated);
        };
    }, []);

    useEffect(() => {
        applyFilter();
    }, [pois, filter]);

    
    const applyFilter = async () => {
        setIsFiltering(true);
        try {
            if (filter === 'all') {
                const userPois = await fetchPersonalPoisData();
                const allPois = [...pois, ...userPois];
                const uniquePois = Array.from(
                    new Map(allPois.map((item) => [item.id, item])).values(),
                );
                setFilteredPois(uniquePois);
            } else if (filter === 'global') {
                setFilteredPois(pois.filter((poi) => poi.type === 'global'));
            } else if (filter === 'local') {
                const userPois = await fetchPersonalPoisData();
                const uniqueUserPois = Array.from(
                    new Map(userPois.map((item) => [item.id, item])).values(),
                );
                setFilteredPois(
                    uniqueUserPois.filter((poi) => poi.type === 'local'),
                );
            } else if (filter === 'personal') {
                const userPois = await fetchPersonalPoisData();
                const uniqueUserPois = Array.from(
                    new Map(userPois.map((item) => [item.id, item])).values(),
                );
                setFilteredPois(
                    uniqueUserPois.filter((poi) => poi.type === 'personal'),
                );
            }
        } finally {
            setIsFiltering(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#1a1a1a] py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-extrabold text-[#0f6fb9] dark:text-white">
                        {t('pointsOfInterest')}
                    </h1>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                        {pois.length} {t('points')}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-[#fff1f0] border border-[#ffd6d6] text-[#c53030]">
                        {error}
                    </div>
                )}

                {showEditForm && (
                    <POIForm
                        formData={formData}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        loading={loading}
                        onCancel={() => {
                            setShowEditForm(false);
                            setEditingId(null);
                        }}
                        onImageChange={handleImageChange}
                        imagePreview={imagePreview}
                    />
                )}

                <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-[#0f6fb9] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {(t('all') || 'Todos').toUpperCase()}
                    </button>
                    <button
                        onClick={() => setFilter('global')}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            filter === 'global'
                                ? 'bg-[#0f6fb9] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {(t('global') || 'Global').toUpperCase()}
                    </button>
                    {isAuthenticated && (
                        <button
                            onClick={() => setFilter('local')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'local'
                                    ? 'bg-[#0f6fb9] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {(t('local') || 'Local').toUpperCase()}
                        </button>
                    )}
                    {isAuthenticated && (
                        <button
                            onClick={() => setFilter('personal')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                filter === 'personal'
                                    ? 'bg-[#0f6fb9] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {(t('personal') || 'Personal').toUpperCase()}
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading || isFiltering ? (
                        Array.from({ length: 6 }).map((_, index) => (
                            <POICardSkeleton key={index} />
                        ))
                    ) : filteredPois.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500">
                            {t('noPois')}
                        </div>
                    ) : (
                        filteredPois.map((poi) => {
                            const isRestricted =
                                poi.type === 'global' ||
                                poi.type === 'local' ||
                                poi.is_global;
                            const canEdit = isAdmin || !isRestricted;
                            return (
                                <div key={poi.id} id={`poi-${poi.id}`}>
                                    <POICard
                                        poi={poi}
                                        onEdit={
                                            canEdit
                                                ? () => handleEdit(poi)
                                                : undefined
                                        }
                                        onDelete={
                                            canEdit
                                                ? () =>
                                                      handleDeleteClick(poi.id)
                                                : undefined
                                        }
                                    />
                                </div>
                            );
                        })
                    )}
                </div>

                {showEditModal && (
                    <>
                        <div
                            className="fixed inset-0 backdrop-blur-sm z-9998"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingId(null);
                                resetForm();
                            }}
                        ></div>
                        <div
                            className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                            onClick={() => {
                                setShowEditModal(false);
                                setEditingId(null);
                                resetForm();
                            }}
                        >
                            <div
                                className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            {t('editPOI')}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowEditModal(false);
                                                setEditingId(null);
                                                resetForm();
                                            }}
                                            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <POIForm
                                        formData={formData}
                                        onChange={handleInputChange}
                                        onSubmit={handleSubmit}
                                        loading={loading}
                                        onCancel={() => {
                                            setShowEditModal(false);
                                            setEditingId(null);
                                            resetForm();
                                        }}
                                        onImageChange={handleImageChange}
                                        imagePreview={imagePreview}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {showDeleteModal && (
                    <>
                        <div
                            className="fixed inset-0 backdrop-blur-sm z-9998"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeletingId(null);
                            }}
                        ></div>
                        <div
                            className="fixed inset-0 flex items-center justify-center z-9999 p-4"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeletingId(null);
                            }}
                        >
                            <div
                                className="bg-white rounded-lg shadow-lg w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {t('deletePOI')}
                                        </h2>
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setDeletingId(null);
                                            }}
                                            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    <p className="text-gray-600 mb-6">
                                        {t('confirmDelete')}
                                    </p>
                                    {error && (
                                        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setDeletingId(null);
                                            }}
                                            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                            disabled={loading}
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? t('deleting')
                                                : t('delete')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
