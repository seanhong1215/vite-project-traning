import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'sweetalert2/dist/sweetalert2.min.css';
import "./assets/style.css";

import App from './App.jsx'
const app = createRoot(document.getElementById('root'));
app.render(
    <App />
)