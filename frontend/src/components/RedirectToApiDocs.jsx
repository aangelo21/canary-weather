import { useEffect } from 'react';

const RedirectToApiDocs = () => {
    useEffect(() => {
        window.location.href = '/api/docs/';
    }, []);

    return null;
};

export default RedirectToApiDocs;
