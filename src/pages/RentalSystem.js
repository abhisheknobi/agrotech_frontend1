// RentalSystem.js
import { useNavigate } from 'react-router-dom';
import '../styles/RentalSystem.css';
import rentalImage from '../components/images/rental image.jpeg';
import addEquipmentImage from '../components/images/add equipment.jpeg';
const RentalSystem = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    console.log('The token is:',token);

    return (
        <div className="rental-system-container">
            <h2>Welcome to the Collaborative Farming Community!</h2>
            <div className="card-container">
                <div className="card" onClick={() => navigate('/addEquipment')}>
                    <img src={addEquipmentImage} alt="Upload Equipment" className="card-image" />
                    <h3>Upload an Item</h3>
                    <p>List your equipment for rent</p>
                </div>
                <div className="card" onClick={() => navigate('/viewEquipment')}>
                    <img src={ rentalImage } alt="Rent Equipment" className="card-image" />
                    <h3>Rent an Item</h3>
                    <p>Browse available equipment to rent</p>
                </div>
            </div>
        </div>
    );
}

export default RentalSystem;
