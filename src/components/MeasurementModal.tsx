import React from 'react';
import { Dialog } from './dialogs/Dialogs';
import MeasurementForm from './MeasurementForm';

const MeasurementModal = () => {
    return (
        <Dialog showCloseButton={false}>
            <div style={{ padding: '0px', minWidth: '300px' }}>
                <p>Enter Measurements</p>
                <MeasurementForm />
            </div>
        </Dialog>
    );
};

export default MeasurementModal;
