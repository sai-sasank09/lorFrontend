import { useNavigate } from 'react-router-dom';

const useTokenNavigation = () => {
    const navigate = useNavigate();

    const checkTokenAndNavigate = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    };

    return checkTokenAndNavigate;
};

export default useTokenNavigation;
