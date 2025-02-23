

const Addresses = () => {  
    const addresses = [
        {
            name: "Home",
            address: "1234 Elm Street",
            city: "Springfield",
            postcode: "12345",
            country: "USA"
        },
        {
            name: "Work",
            address: "5678 Maple Street",
            city: "Shelbyville",
            postcode: "54321",
            country: "USA"
        }
    ];
    return (
        <div className="addresses">
            <h1>My addresses</h1>
            <div className="addresses-list">
                {addresses.map((address, index) => (
                    <div key={index} className="address">
                        <h3>{address.name}</h3>
                        <p>{address.address}</p>
                        <p>{address.city}</p>
                        <p>{address.postcode}</p>
                        <p>{address.country}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Addresses;