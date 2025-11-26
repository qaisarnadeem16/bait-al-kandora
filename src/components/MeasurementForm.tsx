import React, { useState } from 'react';
import './measurement.css';
import useStore from '../Store';
import { useDialogManager } from './dialogs/Dialogs';

// Define the list of measurement fields
const measurementFields = [
    { name: 'Bust', required: true },
    { name: 'Underbust', required: false },
    { name: 'Waist', required: true },
    { name: 'Length Bust X', required: false },
    { name: 'Length Bust Y', required: false },
    { name: 'Small Hip', required: false },
    { name: 'Large Hip', required: true },
    { name: 'Arm', required: false },
    { name: 'Wrist', required: false },
    { name: 'Shoulders Width', required: false },
    { name: 'Sleeve Length', required: false },
    { name: 'Skirt Length', required: true },
];

// Helper to generate tooltip content (placeholder)
const getTooltip = (fieldName: string) => {
    return `Enter the ${fieldName.toLowerCase()} measurement in centimeters.`;
};

const standardSizes = [32, 34, 36, 38, 40, 42];

const MeasurementForm: React.FC = () => {
    const { measurementFormState, setMeasurementFormState, setMeasurementData } = useStore();
    const { closeDialog } = useDialogManager();

    const { selectedSize, showCustom, values } = measurementFormState;
    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateState = (updates: Partial<typeof measurementFormState>) => {
        setMeasurementFormState({ ...measurementFormState, ...updates });
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateState({
            selectedSize: e.target.value,
            showCustom: false,
            values: {}
        });
        setErrors({});
    };

    const toggleCustom = () => {
        updateState({
            showCustom: !showCustom,
            selectedSize: '',
            values: {}
        });
        setErrors({});
    };

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        updateState({
            values: { ...values, [field]: val }
        });
        // Clear error on change
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        measurementFields.forEach(({ name, required }) => {
            const val = values[name] ?? '';
            if (required && !val) {
                newErrors[name] = 'This field is required';
            } else if (val && isNaN(Number(val))) {
                newErrors[name] = 'Only numeric values are allowed';
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePersonalize = () => {
        if (showCustom && !validate()) return;

        // Build measurement data object, include only fields that have a value
        const measurementData: Record<string, string> = {};

        if (showCustom) {
            Object.entries(values).forEach(([key, val]) => {
                if (val) measurementData[key] = val;
            });
        }

        // Add size if a standard size was selected
        if (selectedSize) {
            measurementData['StandardSize'] = selectedSize;
        }

        // If no size and no custom measurements, maybe show error?
        // Assuming at least one is required.
        if (!selectedSize && (!showCustom || Object.keys(measurementData).length === 0)) {
            // If custom is shown but empty, validate() would catch it if fields are required.
            // If custom is NOT shown and no size selected:
            if (!showCustom && !selectedSize) {
                alert("Please select a size or enter custom measurements.");
                return;
            }
        }

        setMeasurementData(measurementData);
        closeDialog('measurement-modal');
    };

    const handleClose = () => {
        closeDialog('measurement-modal');
    };

    return (
        <div className="measurement-form-container">
            <button type="button" className="close-button" onClick={handleClose} aria-label="Close">
                &times;
            </button>
            <label htmlFor="size-dropdown">Select Size:</label>
            <select
                id="size-dropdown"
                className="size-dropdown"
                value={selectedSize}
                onChange={handleSizeChange}
                disabled={showCustom}
            >
                <option value="">-- Choose --</option>
                {standardSizes.map((size) => (
                    <option key={size} value={size.toString()}>{size}</option>
                ))}
            </select>
            <button type="button" className="custom-size-button" onClick={toggleCustom}>
                {showCustom ? 'Cancel Custom Size' : 'Custom Size'}
            </button>

            {showCustom && (
                <form className="measurement-form" onSubmit={(e) => { e.preventDefault(); handlePersonalize(); }}>
                    {measurementFields.map(({ name, required }) => (
                        <div key={name} className="measurement-field">
                            <label>
                                {name}{required && ' *'}
                                <span className="tooltip" title={getTooltip(name)}>ⓘ</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Size in CM"
                                value={values[name] ?? ''}
                                onChange={handleInputChange(name)}
                                className={errors[name] ? 'error' : ''}
                            />
                            {errors[name] && <div className="error-message">{errors[name]}</div>}
                        </div>
                    ))}
                </form>
            )}

            <button type="button" className="personalize-button" onClick={handlePersonalize}>Add Measurements</button>
        </div>
    );
};

export default MeasurementForm;
