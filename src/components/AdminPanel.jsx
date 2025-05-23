import { useState, useEffect } from "react";
import { supabase } from "../supabase";

console.log("Supabase client:", supabase);

function AdminPanel() {
    const [items, setItems] = useState([]);
    const [newRecord, setNewRecord] = useState({
        id: '',
        class: '',
        image: '',
        description: '',
        containment: ''
    });

    const [editRecord, setEditRecord] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(""); // Add this state

    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase.from('scp_subjects').select('*');
            if (error) {
                console.error(error);
            } else {
                // Sort the data by id in ascending order
                const sortedData = data.sort((a, b) => a.id - b.id);
                setItems(sortedData);
            }
        };
        fetchItems();
    }, []);

    const addItem = async () => {
        console.log("addItem function called");
        console.log("New Record:", newRecord);

        // Ensure all fields are filled
        if (!newRecord.id || !newRecord.class || !newRecord.image || !newRecord.description || !newRecord.containment) {
            alert("Please fill in all fields before adding a new SCP.");
            return;
        }

        // Check if SCP ID already exists
        if (items.some(item => String(item.id) === String(newRecord.id))) {
            alert(`SCP-${newRecord.id} already exists. Please use a unique SCP ID.`);
            return;
        }

        // Convert id to a number
        const recordToInsert = {
            ...newRecord,
            id: parseInt(newRecord.id, 10), // Ensure id is a number
        };

        const { error } = await supabase.from('scp_subjects').insert([recordToInsert]);

        if (error) {
            console.error("Error adding new SCP:", error);
            alert("Failed to add SCP. Please check the console for details.");
        } else {
            alert("SCP has been successfully added!");
            window.location.reload(); // Force the page to reload
        }
    };

    const deleteItem = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this SCP?");
        if (!confirmDelete) return;

        const { error } = await supabase.from('scp_subjects').delete().eq('id', id);
        if (error) {
            console.error(error);
        } else {
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
            setDeleteMessage(`SCP-${id} has been deleted.`);
            setTimeout(() => setDeleteMessage(""), 3000); // Hide message after 3 seconds
        }
    };

    const startEditing = (item) => {
        setEditRecord(item);
    };

    const saveEdit = async (id) => {
        const { error } = await supabase.from('scp_subjects').update(editRecord).eq('id', id);
        if (error) {
            console.error(error);
        } else {
            setItems((prevItems) =>
                prevItems.map((item) => (item.id === id ? { ...item, ...editRecord } : item))
            );
            setEditRecord(null);
        }
    };

    return (
        <div className="Display">
            <h1>Admin Panel</h1>
            {deleteMessage && (
                <div style={{ color: "#f45454", textAlign: "center", marginBottom: "1em" }}>
                    {deleteMessage}
                </div>
            )}
            <div className="scp_select">
                <ul>
                    {Array.isArray(items) && items.map((item, idx) => (
                        <li key={item.id}>
                            {editRecord && editRecord.id === item.id ? (
                                <>
                                    <input value={editRecord.id} onChange={(e) => setEditRecord({ ...editRecord, id: e.target.value })} className="edit" />
                                    <select
                                        value={editRecord.class}
                                        onChange={(e) => setEditRecord({ ...editRecord, class: e.target.value })}
                                        className="edit"
                                    >
                                        <option value="">Select Class</option>
                                        <option value="Safe">Safe</option>
                                        <option value="Euclid">Euclid</option>
                                        <option value="Keter">Keter</option>
                                    </select>
                                    <input value={editRecord.image} onChange={(e) => setEditRecord({ ...editRecord, image: e.target.value })} className="edit" />
                                    <input value={editRecord.description} onChange={(e) => setEditRecord({ ...editRecord, description: e.target.value })} className="edit" />
                                    <input value={editRecord.containment} onChange={(e) => setEditRecord({ ...editRecord, containment: e.target.value })} className="edit" />
                                    <button onClick={() => saveEdit(item.id)} className="adminButton2">Save</button>
                                    <button onClick={() => setEditRecord(null)} className="adminButton2">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <h3>SCP-{item.id}</h3>
                                    <img
                                        src={
                                            item.image && (item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('/media/'))
                                                ? (item.image.startsWith('http') ? item.image : `https://uzfxafltcckxursnmvmn.supabase.co${item.image}`)
                                                : 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png'
                                        }
                                        alt={item.id}
                                        className="circ"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png';
                                        }}
                                    />
                                    <button onClick={() => startEditing(item)} className="adminButton2">Edit</button>
                                    <button onClick={() => deleteItem(item.id)} className="adminButton2">Delete</button>
                                </>
                            )}
                            {/* Always render divider except after last item */}
                            {idx < items.length - 1 && <hr className="divider" />}
                        </li>
                    ))}
                </ul>
            </div>

            <h1>Add New Record</h1>
            <div className="add">
                <input value={newRecord.id} onChange={(e) => setNewRecord({ ...newRecord, id: e.target.value })} placeholder="SCP Id {eg: 308}" className="edit" />
                <select
                    value={newRecord.class}
                    onChange={(e) => setNewRecord({ ...newRecord, class: e.target.value })}
                    className="edit"
                >
                    <option value="">Select Class</option>
                    <option value="Safe">Safe</option>
                    <option value="Euclid">Euclid</option>
                    <option value="Keter">Keter</option>
                </select>
                <input value={newRecord.image} onChange={(e) => setNewRecord({ ...newRecord, image: e.target.value })} placeholder="Image" className="edit" />
                <input value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })} placeholder="Description" className="edit" />
                <input value={newRecord.containment} onChange={(e) => setNewRecord({ ...newRecord, containment: e.target.value })} placeholder="Containment" className="edit" />
            </div>
            <div><button onClick={addItem} className="adminButton">Add Item</button></div>
        </div>
    );
}

export default AdminPanel;