import { useState, useEffect } from "react";
import { supabase } from "../supabase";

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
        const { data, error } = await supabase.from('scp_subjects').insert([newRecord]);
        if (error) {
            console.error(error);
        } else {
            setItems((prevItems) => [...prevItems, ...data]);
            setNewRecord({ id: '', class: '', image: '', description: '', containment: '' });
        }
    };

    const deleteItem = async (id) => {
        const { error } = await supabase.from('scp_subjects').delete().eq('id', id);
        if (error) {
            console.error(error);
        } else {
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        }
    };

    const startEditing = (item) => {
        setEditRecord(item);
    };

    const saveEdit = async (id) => {
        const { data, error } = await supabase.from('scp_subjects').update(editRecord).eq('id', id);
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

            <div className="scp_select">
                <ul>
                    {items.map((item) => (
                        <li key={item.id}>
                            {editRecord && editRecord.id === item.id ? (
                                <>
                                    <input value={editRecord.id} onChange={(e) => setEditRecord({ ...editRecord, id: e.target.value })} className="edit" />
                                    <input value={editRecord.class} onChange={(e) => setEditRecord({ ...editRecord, class: e.target.value })} className="edit" />
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
                                            item.image
                                                ? (item.image.startsWith('http://') || item.image.startsWith('https://')
                                                    ? item.image
                                                    : `https://uzfxafltcckxursnmvmn.supabase.co${item.image}`)
                                                : 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png'
                                        }
                                        alt={item.id}
                                        className="circ"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = 'https://res.cloudinary.com/dnekjgjc2/image/upload/v1747171841/logo_ddi4xc.png'; // Fallback image
                                        }}
                                    />
                                    <button onClick={() => startEditing(item)} className="adminButton2">Edit</button>
                                    <button onClick={() => deleteItem(item.id)} className="adminButton2">Delete</button>
                                    <hr className="divider" />
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <h1>Add New Record</h1>
            <div className="add">
                <input value={newRecord.id} onChange={(e) => setNewRecord({ ...newRecord, id: e.target.value })} placeholder="SCP Id {eg: 308}" className="edit" />
                <input value={newRecord.class} onChange={(e) => setNewRecord({ ...newRecord, class: e.target.value })} placeholder="Class" className="edit" />
                <input value={newRecord.image} onChange={(e) => setNewRecord({ ...newRecord, image: e.target.value })} placeholder="Image" className="edit" />
                <input value={newRecord.description} onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })} placeholder="Description" className="edit" />
                <input value={newRecord.containment} onChange={(e) => setNewRecord({ ...newRecord, containment: e.target.value })} placeholder="Containment" className="edit" />
            </div>
            <div><button onClick={addItem} className="adminButton">Add Item</button></div>
        </div>
    );
}

export default AdminPanel;