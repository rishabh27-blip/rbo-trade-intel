import React, { useState } from 'react';

const CapitalSetup = () => {
    const [capital, setCapital] = useState('');

    const handleChange = (e) => {
        setCapital(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(`Capital Setup Submitted: ${capital}`);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="capital">Capital Amount:</label>
            <input
                type="number"
                id="capital"
                value={capital}
                onChange={handleChange}
                required
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default CapitalSetup;