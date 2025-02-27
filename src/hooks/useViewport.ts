import { useState, useEffect } from 'react';

interface Viewport {
    width: number;
    height: number;
    aspectRatio: number;
}

const useViewport = (): Viewport => {
    const [viewport, setViewport] = useState<Viewport>({
        width: window.innerWidth,
        height: window.innerHeight,
        aspectRatio: window.innerWidth / window.innerHeight
    });

    useEffect(() => {
        const handleResize = (): void => {
            setViewport({
                width: window.innerWidth,
                height: window.innerHeight,
                aspectRatio: window.innerWidth / window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return viewport;
};

export default useViewport;
