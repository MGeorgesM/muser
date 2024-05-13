import { useEffect } from 'react';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const useNavigationBarColor = (color) => {
    useEffect(() => {
        const setNavigationBarColor = async (color) => {
            try {
                await SystemNavigationBar.setNavigationColor(color);
            } catch (error) {
                console.log('Error setting navigation bar color:', error);
            }
        };

        setNavigationBarColor(color);
    }, [color]);
};
