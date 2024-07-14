import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './LoadingOverlay.css';

const LoadingOverlay = ({ visible }) => {
    if (!visible) return null;

    return (
        <div className="loading-overlay">
            <ProgressSpinner />
        </div>
    );
};

export default LoadingOverlay;
