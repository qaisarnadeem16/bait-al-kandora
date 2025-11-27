import React from 'react';
import { Dialog } from './dialogs/Dialogs';
import MeasurementForm from './MeasurementForm';

const MeasurementModal = () => {
    return (
        <Dialog showCloseButton={true}>
            <div style={{ padding: '0px', minWidth: '300px' }}>
                <MeasurementForm />
            </div>
        </Dialog>
    );
};

export default MeasurementModal;
