import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

function ScpDetails(){
    const { id } = useParams();
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        const fetchScpDetails = async () => {
            const { data, error } = await supabase
                .from('scp_subjects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching SCP details:", error);
                setItemData(null); // Set itemData to null if there's an error
            } else if (data) {
                setItemData(data); // Set the valid data to itemData
            } else {
                console.error("No data found for the given ID");
                setItemData(null); // Handle case where no data is returned
            }
        };

        fetchScpDetails();
    }, [id]);

    return (
        <div>
            {itemData ? (
                <>
                    <h1>SCP - {itemData.id}</h1>
                    <h3 className="text-center"><strong>Class: </strong>{itemData.class}</h3>
                    <br />
                    <p><strong>Description: </strong>{itemData.description}</p>
                    <p>
                        <img
                            src={
                                itemData.image && (itemData.image.startsWith('http://') || itemData.image.startsWith('https://') || itemData.image.startsWith('/media/'))
                                    ? (itemData.image.startsWith('http') ? itemData.image : `https://uzfxafltcckxursnmvmn.supabase.co${itemData.image}`)
                                    : 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747184260/Classified_qfoayq.png' // Fallback image
                            }
                            alt={itemData.id}
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747184260/Classified_qfoayq.png'; // Fallback image
                            }}
                        />
                    </p>
                    <p><strong>Containment: </strong>{itemData.containment}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default ScpDetails;
