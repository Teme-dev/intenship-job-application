import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import BackendStatus from "./components/BackendStatus";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<BackendStatus />
				<AppRoutes />
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
