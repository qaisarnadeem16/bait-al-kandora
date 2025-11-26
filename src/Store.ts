import { UndoRedoStep } from 'Interfaces';
import React from 'react';
import create from 'zustand';
import { Notification } from './components/widgets/Notifications';
import { TryOnMode, ZakekeTryOnExposedMethods } from '@zakeke/zakeke-configurator-react';

export const MOBILE_BREAKPOINT = 1024;

interface Store {
	isViewerMode: boolean;
	isDraftEditor: boolean;
	isEditorMode: boolean;
	isMobile: boolean;
	setIsMobile: (isMobile: boolean) => void;
	dialogs: { id: string; dialog: React.ReactElement }[];
	addDialog: (id: string, dialog: React.ReactElement) => void;
	removeDialog: (id: string) => void;
	tagsOfSavedDesigns: string[];
	setTagsOfSavedDesigns: (tagsOfSavedDesigns: string[]) => void;
	selectedGroupId: number | null;
	selectedAttributeId: number | null;
	selectedStepId: number | null;
	selectedTemplateGroupId: number | null;
	setSelectedGroupId: (group: number | null) => void;
	setSelectedAttributeId: (attribute: number | null) => void;
	setSelectedStepId: (step: number | null) => void;
	setSelectedTemplateGroupId: (templateGroup: number | null) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	isSavingComposition: boolean;
	setIsSavingComposition: (isSavingComposition: boolean) => void;
	isQuoteLoading: boolean;
	setIsQuoteLoading: (isQuoteLoading: boolean) => void;
	priceFormatter: Intl.NumberFormat;
	setPriceFormatter: (priceFormatter: Intl.NumberFormat) => void;
	undoStack: UndoRedoStep[] | any[any];
	setUndoStack: (callback: (undoStack: UndoRedoStep[] | any[any]) => UndoRedoStep[] | any[any]) => void;
	redoStack: UndoRedoStep[] | any[any];
	setRedoStack: (callback: (redoStack: UndoRedoStep[] | any[any]) => UndoRedoStep[] | any[any]) => void;
	isUndo: boolean;
	setIsUndo: (isUndo: boolean) => void;
	isRedo: boolean;
	setIsRedo: (isRedo: boolean) => void;

	lastSelectedItem: { type: string; id: number | null };
	setLastSelectedItem: (lastSelectedItem: { type: string; id: number | null }) => void;

	tryOnRef?: React.RefObject<ZakekeTryOnExposedMethods>;
	setTryOnRef: (ref: React.RefObject<ZakekeTryOnExposedMethods>) => void;
	pdValue: number;
	setPdValue: (pdValue: number) => void;
	isPDStartedFromCart: boolean;
	setIsPDStartedFromCart: (isPDStartedFromCart: boolean) => void;
	modeTryOn: TryOnMode;
	setTryOnMode: (modeTryOn: TryOnMode) => void;
	notifications: Notification[];
	setNotifications: (notifications: Notification[]) => void;
	removeNotification: (id: number) => void;
	measurementData: Record<string, string> | null;
	setMeasurementData: (data: Record<string, string> | null) => void;
	measurementFormState: {
		selectedSize: string;
		showCustom: boolean;
		values: Record<string, string>;
	};
	setMeasurementFormState: (state: {
		selectedSize: string;
		showCustom: boolean;
		values: Record<string, string>;
	}) => void;
}

const useStore = create<Store>((set) => ({
	isViewerMode: new URLSearchParams(window.location.href).get('viewerMode') ? true : false,
	isDraftEditor: new URLSearchParams(window.location.href).get('isDraftEditor') ? true : false,
	isEditorMode: new URLSearchParams(window.location.href).get('editorMode') ? true : false,

	isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
	setIsMobile: (isMobile: boolean) => {
		set({
			isMobile
		});
	},

	dialogs: [],
	addDialog: (id: string, dialog: React.ReactElement) => {
		set((state) => ({
			dialogs: [...state.dialogs, { id, dialog }]
		}));
	},
	removeDialog: (id: string) => {
		set((state) => ({
			dialogs: state.dialogs.filter((dialog) => dialog.id !== id)
		}));
	},

	isLoading: false,
	setIsLoading: (isLoading: boolean) => {
		set({
			isLoading
		});
	},
	isSavingComposition: false,
	setIsSavingComposition: (isSavingComposition: boolean) => {
		set({
			isSavingComposition
		});
	},
	isQuoteLoading: false,
	setIsQuoteLoading: (isQuoteLoading: boolean) => {
		set({
			isQuoteLoading
		});
	},
	selectedGroupId: null,
	setSelectedGroupId: (groupId) =>
		set({
			selectedGroupId: groupId
		}),
	selectedAttributeId: null,
	setSelectedAttributeId: (attributeId) =>
		set({
			selectedAttributeId: attributeId
		}),
	selectedStepId: null,
	setSelectedStepId: (stepId) =>
		set({
			selectedStepId: stepId
		}),
	selectedTemplateGroupId: null,
	setSelectedTemplateGroupId: (templateGroupId) =>
		set({
			selectedTemplateGroupId: templateGroupId
		}),
	priceFormatter: new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR'
	}),
	setPriceFormatter: (priceFormatter: Intl.NumberFormat) => {
		set({
			priceFormatter
		});
	},
	undoStack: [],
	setUndoStack: (callback) => {
		set((prev) => ({
			undoStack: callback(prev.undoStack)
		}));
	},
	redoStack: [],
	setRedoStack: (callback) => {
		set((prev) => ({
			redoStack: callback(prev.redoStack)
		}));
	},
	isUndo: false,
	setIsUndo: (isUndo: boolean) => {
		set({
			isUndo
		});
	},
	isRedo: false,
	setIsRedo: (isRedo: boolean) => {
		set({
			isRedo
		});
	},

	lastSelectedItem: { type: 'attribute', id: null },
	setLastSelectedItem: (lastSelectedItem: { type: string; id: number | null }) => {
		set({
			lastSelectedItem
		});
	},

	tryOnRef: undefined,
	setTryOnRef: (ref: React.RefObject<ZakekeTryOnExposedMethods>) => {
		set(() => ({
			tryOnRef: ref
		}));
	},

	modeTryOn: TryOnMode.TryOn,
	setTryOnMode: (modeTryOn: TryOnMode) => {
		set(() => ({
			modeTryOn
		}));
	},

	pdValue: 0,
	setPdValue: (pdValue: number) => {
		set(() => ({
			pdValue
		}));
	},
	isPDStartedFromCart: false,
	setIsPDStartedFromCart: (isPDStartedFromCart: boolean) => {
		set(() => ({
			isPDStartedFromCart
		}));
	},
	notifications: [],
	setNotifications: (notifications) => {
		set(() => ({
			notifications
		}));
	},
	removeNotification: (id) => {
		set((state) => ({
			notifications: state.notifications.filter((notification) => notification.id !== id)
		}));
	},

	tagsOfSavedDesigns: [],
	setTagsOfSavedDesigns: (tagsOfSavedDesigns: string[]) => {
		set(() => ({
			tagsOfSavedDesigns
		}));
	},

	measurementData: null,
	setMeasurementData: (measurementData: Record<string, string> | null) => {
		set(() => ({
			measurementData
		}));
	},
	measurementFormState: {
		selectedSize: '',
		showCustom: false,
		values: {}
	},
	setMeasurementFormState: (measurementFormState) => {
		set(() => ({
			measurementFormState
		}));
	}
}));

export default useStore;
