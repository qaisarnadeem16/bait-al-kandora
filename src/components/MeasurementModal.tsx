import React, { useState } from 'react';
import { Dialog } from './dialogs/Dialogs';
import MeasurementForm from './MeasurementForm';

const MeasurementModal = () => {
    const [isFormCompleted, setIsFormCompleted] = useState(false);

    const handleClose = () => {
        // Prevent closing if form is not completed
        if (!isFormCompleted) {
            return;
        }
    };

    return (
        <Dialog 
            showCloseButton={isFormCompleted} 
            onClose={isFormCompleted ? undefined : handleClose}
        >
            <div style={{ padding: '0px', minWidth: '300px' }}>
                <MeasurementForm onFormComplete={() => setIsFormCompleted(true)} />
            </div>
        </Dialog>
    );
};

export default MeasurementModal;
