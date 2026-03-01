import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ViewEquipment.css';
import { BACKEND_URL } from '../config';

const ViewEquipment = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [offerDetails, setOfferDetails] = useState({
        equipmentId: '',
        rentalDuration: '',
        message: '',
    });
    const [offerStatus, setOfferStatus] = useState({}); // Track status per equipment item

    useEffect(() => {
        const fetchEquipment = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${BACKEND_URL}/api/rentalSystem`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEquipmentList(response.data);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipment();
    }, []);

    const handleOfferClick = (equipmentId) => {
        setOfferDetails({ ...offerDetails, equipmentId });
        setShowOfferForm(true);
    };

    const handleOfferSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${BACKEND_URL}/api/rentalSystem/offer/${offerDetails.equipmentId}`,
                {
                    rentalDays: offerDetails.rentalDuration,
                    message: offerDetails.message,
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            alert('Offer sent successfully!');
            setOfferStatus((prev) => ({
                ...prev,
                [offerDetails.equipmentId]: 'requested'
            }));
            setShowOfferForm(false);
        } catch (error) {
            console.error("Error in handleOfferSubmit:", error);
            alert('Failed to send offer');
        }
    };


    return (
        <div className="equipment-list">
            <h1>Welcome to Collaborative Farming Shop</h1>
            <div className='equipment-list-wrapper'>
                {equipmentList.length === 0 ? (
                    <p>There is nothing to rent</p>
                ) : (
                    equipmentList.map((item) => (
                        <div key={item._id} className="equipment-card">
                            <img src={`${BACKEND_URL}/${item.imagePath}`} alt={item.name} className="card-image" />
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Condition: {item.condition}</p>
                            <p>Price: Rs{item.price} per {item.rateType}</p>
                            <p>Location: {item.location}</p>
                            <p>Owner: {item.userName}</p>
                            <p>Upload date: {new Date(item.createdAt).toLocaleDateString('en-US')}</p>
                            <p>Status: {item.available ? 'Available' : 'Not Available'}</p>
                            {item.returnDate && <p>Return Date: {new Date(item.returnDate).toLocaleDateString()}</p>}
                            {item.available ? <button onClick={() => handleOfferClick(item._id)}>Make an Offer</button> : <button disabled>Make an Offer</button>}
                        </div>
                    ))
                )}
                {showOfferForm && (
                    <div className="offer-form">
                        <h3>Make an Offer</h3>
                        <form onSubmit={handleOfferSubmit}>
                            <input
                                type="number"
                                value={offerDetails.rentalDuration}
                                onChange={(e) => setOfferDetails({ ...offerDetails, rentalDuration: e.target.value })}
                                placeholder="Number of days"
                                required
                            />
                            <textarea
                                value={offerDetails.message}
                                onChange={(e) => setOfferDetails({ ...offerDetails, message: e.target.value })}
                                placeholder="Your message"
                                required
                            />
                            <button type="submit">Send Offer</button>
                            <button type="button" onClick={() => setShowOfferForm(false)}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewEquipment;
