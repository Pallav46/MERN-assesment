import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerificationForm from './components/VerificationForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VerificationForm />} />
      </Routes>
    </Router>
  );
}

export default App;