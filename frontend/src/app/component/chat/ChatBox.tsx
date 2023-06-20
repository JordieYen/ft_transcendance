import { useState } from 'react';
import './ChatBox.css'

const ChatBox: React.FC<any> = () => {

	const [messages, setMessages] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	setInputValue(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim() !== '') {
			setMessages([...messages, inputValue]);
			setInputValue('');
		}
	};

    return (
		<div className='chat-box'>
			<div className='chat'>
				<h1 className='chat-name'>Tester ChatBox</h1>
				<ul>
				{messages.map((message, index) => (
					<li key={index}>{message}</li>
				))}
				</ul>
				<form onSubmit={handleSubmit}>
				<input type="text" value={inputValue} onChange={handleInputChange} />
				<button type="submit">Send</button>
				</form>
			</div>
		</div>
  );
};

export default ChatBox;