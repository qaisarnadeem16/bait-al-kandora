import { useZakeke } from '@zakeke/zakeke-configurator-react';
import { T } from 'Helpers';
import { Button } from 'components/Atomic';
import { FormControl } from 'components/widgets/FormControl';
import { FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Dialog, MessageDialog, useDialogManager } from './Dialogs';

const InputContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr auto;
	gap: 10px;
`;

const Input = styled.input`
	width: 100%;
	padding: 10px;
	border: 1px #ddd solid;
	border-radius: 5px;
`;

const AiDialog: FC<{}> = () => {
	const { configureByAI, groups } = useZakeke();
	const [text, setText] = useState('');
	const [isRecording, setIsRecording] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const [isMicEnabled, setMicEnabled] = useState(false);
	const [configurationNotFound, setConfigurationNotFound] = useState(false); 
	const { showDialog, closeDialog, currentDialogId } = useDialogManager();

	const groupsRef = useRef(groups);
	groupsRef.current = groups;

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();

		// Check if mic is enabled
		navigator.mediaDevices
			.getUserMedia({ audio: true })
			.then((x) => {
				setMicEnabled(true);
			})
			.catch((x) => {
				setMicEnabled(false);
			});
	}, []);

	const executeAi = async (text: string) => {
		if (text === '') return;

		setIsGenerating(true);

		// Get all selected options ids
		const beforeAISelectedOptions = groupsRef.current
			.map((group) => {
				const options1 = group.attributes.map((x) => x.options.filter((y) => y.selected)).flat();
				const options2 = group.steps
					.map((x) => x.attributes)
					.flat()
					.map((x) => x.options.filter((y) => y.selected))
					.flat();

				return [...options1, ...options2];
			})
			.map((x) => x.map((y) => y.id))
			.flat();

		try {
			await configureByAI(text);
		} catch {}

		setTimeout(() => {
			// Get all selected options ids
			const afterAISelectedOptions = groupsRef.current
				.map((group) => {
					const options1 = group.attributes.map((x) => x.options.filter((y) => y.selected)).flat();
					const options2 = group.steps
						.map((x) => x.attributes)
						.flat()
						.map((x) => x.options.filter((y) => y.selected))
						.flat();

					return [...options1, ...options2];
				})
				.map((x) => x.map((y) => y.id))
				.flat();

			// Check if there are differences
			const diff = afterAISelectedOptions.filter((x) => !beforeAISelectedOptions.includes(x));
			setIsGenerating(false);

			// If there are differences, show a notification
			if (diff.length === 0) {
				showDialog('no result', <MessageDialog message={T._(' Apologies, no valid configuration found for the given instructions. Please try providing new instructions to generate a suitable configuration.', 'Admin')} />);
				setConfigurationNotFound(true);
				return;
			}

			closeDialog(currentDialogId);
		}, 1000);
	};

	return (
		<Dialog
			alignButtons='center'
			buttons={[
				{
					label: isGenerating ? T._('Generating...', 'Composer') : (configurationNotFound ? T._('Try again', 'Composer') : T._('Generate', 'Composer')),
					onClick: () => executeAi(text),
					disabled: isGenerating
				}
			]}
		>
			<FormControl label={T._('Enter your instructions: describe your desired configuration', 'Composer')}>
				<InputContainer>
					<Input
						ref={inputRef}
						value={text}
						onChange={(e) => setText(e.currentTarget.value)}
						onKeyDown={(e) => {
							// If enter key
							if (e.key === 'Enter') {
								executeAi(text);
							}
						}}
					/>
					{isMicEnabled && (
						<Button
							onClick={() => {
								const SpeechRecognition =
									(window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

								const recognition = new SpeechRecognition();

								recognition.continuous = false;
								recognition.lang = 'it-IT';
								recognition.interimResults = false;
								recognition.maxAlternatives = 1;

								recognition.start();
								setIsRecording(true);

								recognition.onresult = (event: any) => {
									const text = event.results[0][0].transcript;
									setText(text);
									console.log(`Confidence: ${event.results[0][0].confidence}`);

									setIsRecording(false);
									executeAi(text);
								};

								recognition.onspeechend = () => {
									recognition.stop();
									setIsRecording(false);
								};

								recognition.onnomatch = (event: any) => {
									setIsRecording(false);
								};

								recognition.onerror = (event: any) => {
									setIsRecording(false);
								};
							}}
						>
							{!isRecording ? '🎤' : 'Recording...'}
						</Button>
					)}
				</InputContainer>
			</FormControl>
		</Dialog>
	);
};

export default AiDialog;
