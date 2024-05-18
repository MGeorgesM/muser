import { useLayoutEffect, useState } from 'react';
import SystemNavigationBar from 'react-native-system-navigation-bar';

export const useNavigationBarColor = (color) => {
    const [isColorSet, setIsColorSet] = useState(false);

    useLayoutEffect(() => {
        const setNavigationBarColor = async (color) => {
            try {
                await SystemNavigationBar.setNavigationColor(color);
                setIsColorSet(true);
            } catch (error) {
                console.log('Error setting navigation bar color:', error);
            }
        };

        setNavigationBarColor(color);
    }, [color]);

    return isColorSet;
};
