import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

//card component for home page

function Card()
{
    const [item, setItem] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase.from('scp_subjects').select('id, class, image');
            if (error) {
                console.error(error);
            } else {
                // Sort the data by id in ascending order
                const sortedData = data.sort((a, b) => a.id - b.id);
                setItem(sortedData);
            }
        };
        fetchItems();
    }, []);

    return(
        <>
            {item.map((items) => {
                console.log(items); // Debugging: Log each item
                return (
                    <div className='card' key={items.id}>
                        <Link to={`/scp/${items.id}`}>
                            <h2>SCP: {items.id}</h2>
                            <img
                                src={
                                    items.image
                                        ? (items.image.startsWith('http://') || items.image.startsWith('https://')
                                            ? items.image
                                            : `https://uzfxafltcckxursnmvmn.supabase.co${items.image}`)
                                        : 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png'
                                }
                                alt={items.id}
                                className="circ"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop
                                    e.target.src = 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png'; // Fallback image
                                }}
                            />
                            <p><strong>Class: </strong>{items.class}</p>
                        </Link>
                    </div>
                );
            })}
        </>
    )
}

export default Card;