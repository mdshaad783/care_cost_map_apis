import express from 'express';
import hospitalRoutes from './routes/hospitalRoutes.js';
import { initHospitalUrl } from './controllers/hospitalController.js';

const app = express();
app.use(express.json());

app.use('/api/hospitals', hospitalRoutes);

const PORT = process.env.PORT || 3000;


initHospitalUrl().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
    console.error('Failed to init CMS URL:', err.message);
});

