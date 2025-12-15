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

/**
 * PointsOfInterestList Component.
 *
 * The main container for managing and displaying Points of Interest (POIs).
 *
 * Features:
 * - **Listing**: Fetches and displays a list of POIs (Global, Local, and Personal).
 * - **Filtering**: Allows users to filter POIs by type (All, Global, Local, Personal).
 * - **CRUD Operations**: Provides functionality to Create, Read, Update, and Delete POIs.
 * - **Authentication Integration**: Checks user roles (Admin/User) to determine permissions for editing/deleting global vs. personal POIs.
 * - **Modal Management**: Handles UI state for Edit and Delete confirmation modals.
 * - **Image Handling**: Manages image selection and preview during POI creation/editing.
 *
 * @component
 * @returns {JSX.Element} The rendered PointsOfInterestList component.
 */
export default function PointsOfInterestList() {
    const { t } = useTranslation();

    /**
     * @type {[boolean, Function]} isAuthenticated - State to check if the user is logged in.
     */
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
     * @type {[boolean, Function]} isAdmin - State to check if the logged-in user is an admin.
     */
    const [isAdmin, setIsAdmin] = useState(false);

    /**
     * @type {[Array<Object>, Function]} pois - State to store the full list of fetched POIs.
     */
    const [pois, setPois] = useState([]);

    /**
     * @type {[Array<Object>, Function]} filteredPois - State to store the list of POIs currently displayed based on the filter.
     */
    const [filteredPois, setFilteredPois] = useState([]);

    /**
     * @type {[string, Function]} filter - State for the current filter criteria ('all', 'global', 'local', 'personal').
     */
    const [filter, setFilter] = useState('all');

    /**
     * @type {[Object, Function]} formData - State for the POI form data.
     */
    const [formData, setFormData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        description: '',
        is_global: false,
    });

    /**
     * @type {[boolean, Function]} showEditForm - State to toggle the visibility of the inline edit form (legacy/unused?).
     */
    const [showEditForm, setShowEditForm] = useState(false);

    /**
     * @type {[boolean, Function]} showEditModal - State to toggle the visibility of the Edit Modal.
     */
    const [showEditModal, setShowEditModal] = useState(false);

    /**
     * @type {[boolean, Function]} showDeleteModal - State to toggle the visibility of the Delete Confirmation Modal.
     */
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    /**
     * @type {[number|null, Function]} editingId - State to store the ID of the POI currently being edited.
     */
    const [editingId, setEditingId] = useState(null);

    /**
     * @type {[number|null, Function]} deletingId - State to store the ID of the POI currently being deleted.
     */
    const [deletingId, setDeletingId] = useState(null);

    /**
     * @type {[boolean, Function]} loading - State to indicate if an API operation is in progress.
     */
    const [loading, setLoading] = useState(false);

    /**
     * @type {[boolean, Function]} isFiltering - State to indicate if the list is being filtered/loaded.
     */
    const [isFiltering, setIsFiltering] = useState(true);

    /**
     * @type {[string, Function]} error - State to store error messages.
     */
    const [error, setError] = useState('');

    /**
     * @type {[File|null, Function]} selectedImage - State to store the selected image file for upload.
     */
    const [selectedImage, setSelectedImage] = useState(null);

    /**
     * @type {[string|null, Function]} imagePreview - State to store the preview URL of the selected image.
     */
    const [imagePreview, setImagePreview] = useState(null);

    /**
     * Fetches all available POIs from the backend service.
     * Updates the `pois` state and handles loading/error states.
     */
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

    /**
     * Fetches personal POIs for the currently logged-in user.
     *
     * @returns {Promise<Array<Object>>} An array of personal POI objects, or an empty array if not logged in or on error.
     */
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

    /**
     * Handles the form submission for creating or updating a POI.
     * Calls the `createOrUpdatePoi` service and refreshes the list upon success.
     *
     * @param {Event} e - The form submission event.
     */
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

    /**
     * Opens the delete confirmation modal for a specific POI.
     *
     * @param {number} id - The ID of the POI to delete.
     */
    const handleDeleteClick = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    /**
     * Confirms and executes the deletion of the selected POI.
     */
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

    /**
     * Prepares the form for editing a specific POI.
     * @param {Object} poi - The POI object to edit.
     */
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

    /**
     * Resets the form data and state.
     */
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

    /**
     * Handles changes in form input fields.
     * @param {Event} e - The input change event.
     */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    /**
     * Handles the selection of an image file.
     * @param {Event} e - The file input change event.
     */
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

    /**
     * Applies the selected filter to the list of POIs.
     */
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
