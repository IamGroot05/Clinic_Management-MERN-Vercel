import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast, { Toaster } from "react-hot-toast";
import { faPlus, faSave, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const MedicalRepresentativeForm = ({ mrData, onSuccess }) => {
    const api = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const [formData, setFormData] = useState({
        name: mrData?.name || '',
        email: mrData?.email || '',
        phone: mrData?.phone || '',
        company: mrData?.company || '',
        address: mrData?.address || '',
        region: mrData?.region || '',
        visits: mrData?.visits || [
            {
                visit_date: new Date().toISOString().split('T')[0],
                discount: 0,
                products: [{ name: '', quantity: 1, price: null, finalPrice: null }],
            },
        ],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const added = (value) => toast.success(value);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleProductChange = (visitIndex, productIndex, e) => {
        const { name, value } = e.target;
        const updatedVisits = [...formData.visits];
        const product = updatedVisits[visitIndex].products[productIndex];

        product[name] = name === 'quantity' || name === 'price' ? Number(value) : value;

        // Calculate final price
        if (name === 'quantity' || name === 'price') {
            product.finalPrice = product.quantity * product.price;
        }

        setFormData((prev) => ({
            ...prev,
            visits: updatedVisits,
        }));
    };

    const addProductField = (visitIndex) => {
        const updatedVisits = [...formData.visits];
        updatedVisits[visitIndex].products.push({ name: '', quantity: 1, price: null, finalPrice: null });
        setFormData((prev) => ({
            ...prev,
            visits: updatedVisits,
        }));
    };

    const removeProductField = (visitIndex, productIndex) => {
        const updatedVisits = [...formData.visits];
        updatedVisits[visitIndex].products.splice(productIndex, 1);
        setFormData((prev) => ({
            ...prev,
            visits: updatedVisits,
        }));
    };

    const handleDiscountChange = (visitIndex, e) => {
        const { value } = e.target;
        const updatedVisits = [...formData.visits];
        updatedVisits[visitIndex].discount = Number(value);

        setFormData((prev) => ({
            ...prev,
            visits: updatedVisits,
        }));
    };

    const calculateTotalPayment = (visitIndex) => {
        const visit = formData.visits[visitIndex];
        return visit.products.reduce((total, product) => total + product.finalPrice, 0);
    };

    const calculateGrandTotal = (visitIndex) => {
        const visit = formData.visits[visitIndex];
        const totalPayment = calculateTotalPayment(visitIndex);
        const discount = (totalPayment * visit.discount) / 100;
        return totalPayment - discount;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${api}/api/docs/mr`, formData);
            setLoading(false);

            if (onSuccess) {
                onSuccess(response.data); // Callback for success
                added('Added Successfully')
                setFormData({
                    name: mrData?.name || '',
                    email: mrData?.email || '',
                    phone: mrData?.phone || '',
                    company: mrData?.company || '',
                    address: mrData?.address || '',
                    region: mrData?.region || '',
                    visits: mrData?.visits || [
                        {
                            visit_date: new Date().toISOString().split('T')[0],
                            products: [{ name: '', quantity: 0, price: 0, finalPrice: 0 }],
                        },
                    ],
                });
            }
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'An error occurred while saving data.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <Toaster />
            <h2 className="text-3xl font-semibold text-center text-[var(--primary)] mb-8">Medical Representative Form</h2>
            <form onSubmit={handleSubmit}>
                {/* MR Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Company */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                        <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                    {/* Region */}
                    <div>
                        <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
                        <input
                            type="text"
                            id="region"
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* Visits and Products */}
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-700">Products</h3>
                    {formData.visits.map((visit, visitIndex) => (
                        <div key={visitIndex}>
                            <h4 className="text-lg font-semibold mt-4">Visit {visitIndex + 1}</h4>
                            <div className="mt-4">
                                {visit.products.map((product, productIndex) => (
                                    <div className='flex items-center gap-3'>
                                        <div
                                            key={productIndex}
                                            className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center mb-4"
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={product.name}
                                                    onChange={(e) => handleProductChange(visitIndex, productIndex, e)}
                                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    value={product.quantity}
                                                    onChange={(e) => handleProductChange(visitIndex, productIndex, e)}
                                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={product.price}
                                                    onChange={(e) => handleProductChange(visitIndex, productIndex, e)}
                                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Final Price</label>
                                                <input
                                                    type="number"
                                                    name="finalPrice"
                                                    value={product.finalPrice}
                                                    readOnly
                                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeProductField(visitIndex, productIndex)}
                                            className="p-2 text-red-600 w-8 h-8"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                ))}
                                <div className='flex justify-between'>
                                    <button
                                        type="button"
                                        onClick={() => addProductField(visitIndex)}
                                        className="mt-4 p-2 h-12 text-white bg-emerald-600 rounded-md hover:bg-emerald-700"
                                    >
                                        <FontAwesomeIcon icon={faPlus} /> Add Product
                                    </button>
                                    <div className="mt-4">
                                        <p className='text-[1.1rem] font-semibold'>Total Payment :  <span>&#8377;{calculateTotalPayment(visitIndex)}</span></p>
                                        <div className='flex gap-2'> 
                                            <label htmlFor="discount" className="text-[18px] block text-sm font-medium text-gray-700">Discount (%) :  </label>
                                            <input
                                                type="number"
                                                id="discount"
                                                size={20}
                                                value={visit.discount}
                                                onChange={(e) => handleDiscountChange(visitIndex, e)}
                                                className="text-[1rem] max-w-[50px] min-w-[50px] font-medium"
                                            />
                                        </div>
                                        <div className="border-t border-gray-300 my-3"></div>
                                        <p className='text-[1.2rem] font-semibold'>Grand Total : <span>&#8377;{calculateGrandTotal(visitIndex)}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        className="inline-flex items-center px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600"
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={mrData ? faEdit : faSave} className="mr-2" />
                        {loading ? 'Saving...' : mrData ? 'Update Medical Representative' : 'Save Medical Representative'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default MedicalRepresentativeForm;
