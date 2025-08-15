import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import { AuctionProvider } from './contexts/AuctionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<SocketProvider>
			<AuctionProvider>
				<App />
			</AuctionProvider>
		</SocketProvider>
	</React.StrictMode>
);
