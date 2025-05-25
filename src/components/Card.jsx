import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

//card component for home page
function Card()
{
    const [item, setItem] = useState([]);

    //blcok for fetching SCP records from the database on component mount
    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase.from('scp_subjects').select('id, class, image');
            if (error) {
                console.error(error);
            } else {
                //sort scp data by id
                const sortedData = data.sort((a, b) => a.id - b.id);
                setItem(sortedData);
            }
        };
        fetchItems();
    }, []);

    //return block for displaying the SCP cards
    return(
        <>
            {/* block of code for mapping through and displaying each scp */}
            {item.map((items) => {
                return (
                    <div className='card' key={items.id}>
                        <Link to={`/scp/${items.id}`}>
                            <h2>SCP: {items.id}</h2>
                            {/* image with code to ensure fallback image is in place */}
                            <img
                                src={
                                    items.image && (items.image.startsWith('http://') || items.image.startsWith('https://') || items.image.startsWith('/media/'))
                                        ? (items.image.startsWith('http') ? items.image : `https://uzfxafltcckxursnmvmn.supabase.co${items.image}`)
                                        : 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png' //fallback image
                                }
                                alt={items.id}
                                className="circ"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png'; //fallback image
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