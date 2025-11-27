import React, { useState } from 'react';
import '../styles/measurement.css';
import useStore from '../Store';
import { useDialogManager } from './dialogs/Dialogs';

type MeasurementType = 'kandora' | 'body';
type FittingType = 'slim' | 'regular' | 'loose';
type NeckLengthType = 'A' | 'K';
type ShoulderLineType = 'regular' | 'sloping' | 'square';

interface MeasurementValues {
    [key: string]: string;
}

const MeasurementForm: React.FC = () => {
    const [measurementType, setMeasurementType] = useState<MeasurementType>('kandora');
    const [values, setValues] = useState<MeasurementValues>({});
    const [fitting, setFitting] = useState<FittingType>('regular');
    const [neckType, setNeckType] = useState<NeckLengthType>('A');
    const [lengthType, setLengthType] = useState<NeckLengthType>('A');
    const [shoulderLine, setShoulderLine] = useState<ShoulderLineType>('regular');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { setMeasurementData } = useStore();
    const { closeDialog } = useDialogManager();

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValues((prev) => ({ ...prev, [field]: val }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validate = (fields: string[]): boolean => {
        const newErrors: Record<string, string> = {};
        fields.forEach((field) => {
            if (!values[field]) {
                newErrors[field] = 'Required';
            } else if (isNaN(Number(values[field]))) {
                newErrors[field] = 'Number only';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePersonalize = () => {
        const kandoraFields = [
            'Neck',
            'Shoulder',
            'Chest',
            'Front Cross',
            'Waist',
            'Sleeve Left',
            'Sleeve Right',
            'Arm Hole',
            'Bicep',
            'Wrist',
            'Base Width',
            'Border',
            'Length'
        ];

        const bodyFields = [
            'Neck',
            'Shoulder',
            'Chest',
            'Waist',
            'Sleeve',
            'Wrist',
            'Length'
        ];

        const fields = measurementType === 'kandora' ? kandoraFields : bodyFields;

        if (!validate(fields)) return;

        const data: Record<string, string> = {
            MeasurementType: measurementType === 'kandora' ? 'Kandora Measurement' : 'Body Measurement',
            Fitting: fitting.charAt(0).toUpperCase() + fitting.slice(1) + ' Fit',
            NeckType: neckType === 'A' ? 'Arabic' : 'Kuwaiti',
            LengthType: lengthType === 'A' ? 'Arabic' : 'Kuwaiti',
            ShoulderLine: shoulderLine.charAt(0).toUpperCase() + shoulderLine.slice(1),
            ...values
        };

        setMeasurementData(data);
        closeDialog('measurement-modal');
    };

    const renderField = (label: string, field: string, special?: 'neck' | 'length', fullWidth?: boolean) => (
        <div className={`measurement-grid-item ${fullWidth ? 'full-width' : ''}`} key={field}>
            <label className="measurement-label">{label}</label>
            <div className="input-wrapper">
                {(special === 'neck' || special === 'length') && (
                    <div className="radio-group-inline">
                        <label className={`radio-pill ${(special === 'neck' ? neckType : lengthType) === 'A' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name={`${field}Type`}
                                checked={(special === 'neck' ? neckType : lengthType) === 'A'}
                                onChange={() => special === 'neck' ? setNeckType('A') : setLengthType('A')}
                            /> A (Arabic)
                        </label>
                        <label className={`radio-pill ${(special === 'neck' ? neckType : lengthType) === 'K' ? 'active' : ''}`}>
                            <input
                                type="radio"
                                name={`${field}Type`}
                                checked={(special === 'neck' ? neckType : lengthType) === 'K'}
                                onChange={() => special === 'neck' ? setNeckType('K') : setLengthType('K')}
                            /> K (Kuwaiti)
                        </label>
                    </div>
                )}
                <input
                    type="text"
                    className={`measurement-input ${errors[field] ? 'error' : ''}`}
                    value={values[field] || ''}
                    onChange={handleInputChange(field)}
                    placeholder="0.00 CM"
                />
                {errors[field] && <div className="error-text">{errors[field]}</div>}
            </div>
        </div>
    );

    return (
        <div className="measurement-container">
            <div className="measurement-header">
                <h2>{measurementType === 'kandora' ? 'Kandora' : 'Body'} Measurements</h2>
                <div className="measurement-tabs-pill">
                    <button
                        className={`pill-tab ${measurementType === 'kandora' ? 'active' : ''}`}
                        onClick={() => setMeasurementType('kandora')}
                    >
                        Kandora
                    </button>
                    <button
                        className={`pill-tab ${measurementType === 'body' ? 'active' : ''}`}
                        onClick={() => setMeasurementType('body')}
                    >
                        Body
                    </button>
                </div>
            </div>
            <div className=" half-width">
                <div className=" dropdown">
                    <label className="measurement-label">Fitting Option</label>
                    <select
                        className="measurement-select"
                        value={fitting}
                        onChange={(e) => setFitting(e.target.value as FittingType)}
                    >
                        <option value="regular">Regular Fit</option>
                        <option value="slim">Slim Fit</option>
                        <option value="loose">Loose Fit</option>
                    </select>
                </div>

                <div className="dropdown">
                    <label className="measurement-label">Shoulder Down</label>
                    <select
                        className="measurement-select"
                        value={shoulderLine}
                        onChange={(e) => setShoulderLine(e.target.value as ShoulderLineType)}
                    >
                        <option value="regular">Regular</option>
                        <option value="sloping">Sloping</option>
                        <option value="square">Square</option>
                    </select>
                </div>
            </div>

            <div className=" half-width">
                <div className="dropdown">
                    {renderField('Neck', 'Neck', 'neck', true)}
                </div>
                <div className="dropdown">
                    {renderField('Length', 'Length', 'length', true)}
                </div>

            </div>
            <div className="measurement-grid">
                {/* Global Options Row */}


                {/* Measurement Fields */}
                {renderField('Shoulder', 'Shoulder')}
                {renderField('Chest', 'Chest')}
                {measurementType === 'kandora' && renderField('Front Cross', 'Front Cross')}
                {renderField('Waist', 'Waist')}

                {measurementType === 'kandora' ? (
                    <>
                        {renderField('Sleeve Left', 'Sleeve Left')}
                        {renderField('Sleeve Right', 'Sleeve Right')}
                    </>
                ) : (
                    renderField('Sleeve', 'Sleeve')
                )}

                {measurementType === 'kandora' && renderField('Arm Hole', 'Arm Hole')}
                {measurementType === 'kandora' && renderField('Bicep', 'Bicep')}
                {renderField('Wrist', 'Wrist')}
                {measurementType === 'kandora' && renderField('Base Width', 'Base Width')}
                {measurementType === 'kandora' && renderField('Border', 'Border')}


            </div>

            <button className="personalize-button" onClick={handlePersonalize}>
                Add Measurements
            </button>
        </div>
    );
};

export default MeasurementForm;
