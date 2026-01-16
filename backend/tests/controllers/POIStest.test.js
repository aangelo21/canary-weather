
import { jest } from '@jest/globals';

// Mocks for PointOfInterst Controller
jest.unstable_mockModule('../../services/poi/poiFilterService.js', () => ({
    getAllVisiblePois: jest.fn(),
    getPersonalPois: jest.fn(),
    getPoiById: jest.fn(),
}));

jest.unstable_mockModule('../../services/poi/poiManagementService.js', () => ({
    createPoi: jest.fn(),
    updatePoi: jest.fn(),
    deletePoi: jest.fn(),
}));

// Mocks for Admin Controller
jest.unstable_mockModule('../../models/index.js', () => ({
    PointOfInterest: {
        count: jest.fn(),
        findAll: jest.fn(),
    },
    Alert: {
        count: jest.fn(),
    },
    User: {
        count: jest.fn(),
        findAll: jest.fn(),
    },
    UserLocation: {
        findAll: jest.fn(),
    },
    Location: {},
}));

jest.unstable_mockModule('../../controllers/dbController.js', () => ({
    default: {
        fn: jest.fn((fnName, col) => `${fnName}(${col})`),
        col: jest.fn((colName) => colName),
    },
}));

jest.unstable_mockModule('../../services/ldapService.js', () => ({
    LdapService: {
        getAllUsers: jest.fn(),
    },
}));

jest.unstable_mockModule('sequelize', () => ({
    Op: {
        like: 'LIKE',
        or: 'OR',
    },
}));


// Dynamic imports after mocks
const poiController = await import('../../controllers/pointOfInterestController.js');
const adminController = await import('../../controllers/adminController.js');
const { getAllVisiblePois, getPoiById } = await import('../../services/poi/poiFilterService.js');
const { createPoi, updatePoi, deletePoi } = await import('../../services/poi/poiManagementService.js');
const { PointOfInterest, Alert, User, UserLocation } = await import('../../models/index.js');

describe('Backend Tests: Enfoque 1, Enfoque 2, Dashboard', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: {},
            body: {},
            query: {},
            user: { id: 1, role: 'admin' },
            file: null,
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
            render: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('Enfoque 1: CRUD Operations (PointOfInterest)', () => {
        // 1. READ
        it('should get all visible POIs (READ)', async () => {
            const mockPois = [{ id: 1, name: 'POI 1' }, { id: 2, name: 'POI 2' }];
            getAllVisiblePois.mockResolvedValue(mockPois);

            await poiController.getAllPointsOfInterest(req, res);

            expect(getAllVisiblePois).toHaveBeenCalledWith(req.user);
            expect(res.json).toHaveBeenCalledWith(mockPois);
        });

        // 2. CREATE
        it('should create a new POI (CREATE)', async () => {
            req.body = { name: 'New POI', description: 'Test' };
            const createdPoi = { id: 3, ...req.body };
            createPoi.mockResolvedValue(createdPoi);

            await poiController.createPointOfInterest(req, res);

            expect(createPoi).toHaveBeenCalledWith(req.body, req.user.id);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(createdPoi);
        });

        // 3. UPDATE (Method Call)
        it('should update an existing POI (UPDATE)', async () => {
            req.params.id = 1;
            req.body = { name: 'Updated POI' };
            const updatedPoi = { id: 1, name: 'Updated POI' };
            updatePoi.mockResolvedValue(updatedPoi);

            await poiController.updatePointOfInterest(req, res);

            expect(updatePoi).toHaveBeenCalledWith(1, req.body, null, req.user.id);
            expect(res.json).toHaveBeenCalledWith(updatedPoi);
        });

        // 4. DELETE
        it('should delete a POI (DELETE)', async () => {
            req.params.id = 1;
            deletePoi.mockResolvedValue(true);

            await poiController.deletePointOfInterest(req, res);

            expect(deletePoi).toHaveBeenCalledWith(1, req.user.id);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });
    });

    describe('Enfoque 2: Form Operation (PointOfInterest)', () => {
        // Enfoque 2: Form submission with validation or file handling
        it('should handle form submission with file upload (UPDATE with File)', async () => {
            req.params.id = 1;
            req.body = { name: 'POI with Image' };
            req.file = { filename: 'image.jpg', path: '/uploads/image.jpg' };
            
            const updatedPoiWithImage = { id: 1, name: 'POI with Image', imageUrl: 'image.jpg' };
            updatePoi.mockResolvedValue(updatedPoiWithImage);

            await poiController.updatePointOfInterest(req, res);

            // Verify updatePoi was called with the file object
            expect(updatePoi).toHaveBeenCalledWith(1, req.body, req.file, req.user.id); 
            expect(res.json).toHaveBeenCalledWith(updatedPoiWithImage);
        });
    });

    describe('Dashboard Query (AdminController)', () => {
        it('should retrieve dashboard statistics and render dashboard view', async () => {
            // Mock data
            PointOfInterest.count.mockResolvedValue(10);
            Alert.count.mockResolvedValue(5);
            User.count.mockResolvedValue(20);
            
            PointOfInterest.findAll.mockResolvedValue([]); // For recent POIs and charts
            User.findAll.mockResolvedValue([]); // For recent users and charts
            UserLocation.findAll.mockResolvedValue([]); // For location stats

            await adminController.getDashboard(req, res);

            expect(PointOfInterest.count).toHaveBeenCalled();
            expect(Alert.count).toHaveBeenCalled();
            // Verify render is called with expected data keys
            expect(res.render).toHaveBeenCalledWith('dashboard', expect.objectContaining({
                poisCount: 10,
                alertsCount: 5,
                usersCount: 20
            }));
        });
    });
});
