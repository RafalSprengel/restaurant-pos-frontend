import { useEffect, useState } from "react";

const Categories = () => {
    const [categoryList, setCategoryList] = useState(null)
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const getAllCategories = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await fetch('http://localhost:3001/api/getAllCategories', options);
            if (response.ok) {
                const data = await response.json();
                setCategoryList(data)
            } else {
                const errorData = await response.json()
                console.log('Server error: ' + errorData.error)
            }
        } catch (error) {
            console.error('Error during dodnloading data: ' + error)

        } finally {
            setIsLoading(false)
        }
    };

    const List = ({ el }) => {
        return (
            <tr>
                <td>{el.name}</td>
                <td>delete</td>
            </tr>
        )
    }


    const list = categoryList?.map(el => {
        return (
            <List key={el._id} el={el} />
        )
    })
    useEffect(() => {
        getAllCategories()
    }, [])

    return (<>
        {isLoading && <h3>Loading data...</h3>}
        {error && <h3>Something went rong :(</h3>}
        {!isLoading && !error &&
            <>
                <h2>Categories</h2>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Options</td>
                        </tr>
                    </thead>
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </>
        }
    </>
    )
}

export default Categories;