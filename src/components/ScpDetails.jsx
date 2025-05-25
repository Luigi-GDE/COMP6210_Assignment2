import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

//component for displaying SCP details
function ScpDetails() {
    //get scp id from url parameters
    const { id } = useParams();

    //state for holding SCP details
    const [itemData, setItemData] = useState(null);

    //fetch SCP details from the database when scp card is clicked
    useEffect(() => {
        const fetchScpDetails = async () => {
            const { data, error } = await supabase
                .from('scp_subjects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching SCP details:", error);
                setItemData(null);
            } else if (data) {
                setItemData(data);
            } else {
                console.error("No data found for the given ID");
                setItemData(null);
            }
        };

        fetchScpDetails();
    }, [id]);

    //return block for displaying SCP details
    return (
        <div>
            {itemData ? (
                <>
                    <h1>SCP - {itemData.id}</h1>
                    <h3 className="text-center"><strong>Class: </strong>{itemData.class}</h3>
                    <br />
                    <p><strong>Description: </strong>{itemData.description}</p>
                    <p>
                        {/* image with code for fallback image */}
                        <img
                            src={
                                itemData.image && (itemData.image.startsWith('http://') || itemData.image.startsWith('https://') || itemData.image.startsWith('/media/'))
                                    ? (itemData.image.startsWith('http') ? itemData.image : `https://uzfxafltcckxursnmvmn.supabase.co${itemData.image}`)
                                    : 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747184260/Classified_qfoayq.png'
                            }
                            alt={itemData.id}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747184260/Classified_qfoayq.png';
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
