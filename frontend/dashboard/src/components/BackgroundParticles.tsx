import React from 'react';

const BackgroundParticles = () => {
    // Generate random particles with different sizes, speeds, and positions
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 300 + 100}px`,
        height: `${Math.random() * 300 + 100}px`,
        animationDuration: `${Math.random() * 20 + 20}s`, // Slow, relaxing movement
        animationDelay: `-${Math.random() * 40}s`, // Start at random points in cycle
        opacity: Math.random() * 0.3 + 0.4, // HIGH OPACITY: 0.4 to 0.7
        background: i % 2 === 0
            ? 'radial-gradient(circle, rgba(74,222,128,0.5) 0%, rgba(0,0,0,0) 70%)' // Stronger Green
            : 'radial-gradient(circle, rgba(96,165,250,0.5) 0%, rgba(0,0,0,0) 70%)' // Stronger Blue
    }));

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full animate-float blur-2xl"
                    style={{
                        left: p.left,
                        width: p.width,
                        height: p.height,
                        animationDuration: p.animationDuration,
                        animationDelay: p.animationDelay,
                        opacity: p.opacity,
                        background: p.background,
                        bottom: '-40%'
                    }}
                />
            ))}
        </div>
    );
};

export default BackgroundParticles;
