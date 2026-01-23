import React, { useState } from 'react';
import '../styles/measurement.css';
import useStore from '../Store';
import { useDialogManager } from './dialogs/Dialogs';

type MeasurementType = 'kandora' | 'body';
type FittingType = 'slim' | 'regular' | 'loose';
type NeckLengthType = 'A' | 'K';
type ShoulderLineType = 'regular' | 'sloping' | 'square';
type UnitType = 'cm' | 'inch';

interface MeasurementValues {
    [key: string]: string;
}

interface MeasurementFormProps {
    onFormComplete?: () => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ onFormComplete }) => {
    const [measurementType, setMeasurementType] = useState<MeasurementType>('kandora');
    const [values, setValues] = useState<MeasurementValues>({});
    const [fitting, setFitting] = useState<FittingType>('regular');
    const [neckType, setNeckType] = useState<NeckLengthType>('A');
    const [lengthType, setLengthType] = useState<NeckLengthType>('A');
    const [shoulderLine, setShoulderLine] = useState<ShoulderLineType>('regular');
    const [unit, setUnit] = useState<UnitType>('cm');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { setMeasurementData } = useStore();
    const { closeDialog } = useDialogManager();

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow only numbers and decimal point
        const numericValue = val.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        const parts = numericValue.split('.');
        const filteredValue = parts.length > 2 
            ? parts[0] + '.' + parts.slice(1).join('') 
            : numericValue;
        
        setValues((prev) => ({ ...prev, [field]: filteredValue }));
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

        // Validate all fields (unit is already set to 'cm' by default)
        if (!validate(fields)) return;

        // Append unit to each measurement value
        const valuesWithUnit: Record<string, string> = {};
        fields.forEach((field) => {
            if (values[field]) {
                valuesWithUnit[field] = `${values[field]}${unit}`;
            }
        });

        const data: Record<string, string> = {
            MeasurementType: measurementType === 'kandora' ? 'Kandora Measurement' : 'Body Measurement',
            Unit: unit === 'cm' ? 'Centimeters' : 'Inches',
            Fitting: fitting.charAt(0).toUpperCase() + fitting.slice(1) + ' Fit',
            NeckType: neckType === 'A' ? 'Arabic' : 'Kuwaiti',
            LengthType: lengthType === 'A' ? 'Arabic' : 'Kuwaiti',
            ShoulderLine: shoulderLine.charAt(0).toUpperCase() + shoulderLine.slice(1),
            ...valuesWithUnit
        };

        setMeasurementData(data);
        if (onFormComplete) {
            onFormComplete();
        }
        closeDialog('measurement-modal');
    };

    const renderField = (label: string, field: string, special?: 'neck' | 'length', fullWidth?: boolean) => (
        <div className={`measurement-grid-item ${fullWidth ? 'full-width' : ''}`} key={field}>
            <label className="measurement-label required-label">
                {label} <span className="required-asterisk">*</span>
            </label>
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
                    inputMode="decimal"
                    pattern="[0-9.]*"
                    className={`measurement-input ${errors[field] ? 'error' : ''}`}
                    value={values[field] || ''}
                    onChange={handleInputChange(field)}
                    placeholder={unit ? `0.00 ${unit.toUpperCase()}` : '0.00'}
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
            
            {/* Unit Selector - Required Field */}
            <div className="measurement-header1">
                <label className="measurement-label required-label">
                    Unit of Measurement <span className="required-asterisk">*</span>
                </label>
                <div className="measurement-tabs-pill">
                    <button
                        type="button"
                        className={`pill-tab ${unit === 'cm' ? 'active' : ''}`}
                        onClick={() => {
                            setUnit('cm');
                            if (errors['unit']) {
                                setErrors((prev) => ({ ...prev, unit: '' }));
                            }
                        }}
                    >
                        CM
                    </button>
                    <button
                        type="button"
                        className={`pill-tab ${unit === 'inch' ? 'active' : ''}`}
                        onClick={() => {
                            setUnit('inch');
                            if (errors['unit']) {
                                setErrors((prev) => ({ ...prev, unit: '' }));
                            }
                        }}
                    >
                        Inch
                    </button>
                </div>
                {errors['unit'] && <div className="error-text">{errors['unit']}</div>}
            </div>
            <div className=" half-width">
                <div className=" dropdown">
                    <label className="measurement-label required-label">
                        Fitting Option <span className="required-asterisk">*</span>
                    </label>
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
                    <label className="measurement-label required-label">
                        Shoulder Down <span className="required-asterisk">*</span>
                    </label>
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
