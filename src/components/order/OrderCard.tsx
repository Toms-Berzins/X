import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: string;
  details: string;
}

interface OrderCardProps {
  order: Order;
  onUpdate: (order: Order) => void;
  onProceed: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onUpdate, onProceed }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Order>(order);

  const toggleExpand = () => setExpanded(!expanded);
  const toggleEdit = () => {
    if (editing) {
      setEditData(order); // Reset form data when canceling
    }
    setEditing(!editing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(editData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating order:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-4 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold">{order.title}</h4>
        <button 
          onClick={toggleExpand}
          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1"
          aria-label={expanded ? "Collapse order details" : "Expand order details"}
        >
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>

      <div className="relative mt-4 aspect-video">
        <img 
          src={order.imageUrl} 
          alt={order.title} 
          className="w-full h-48 object-cover rounded-lg shadow-md"
          loading="lazy"
        />
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`overflow-hidden ${expanded ? 'mt-4' : ''}`}
      >
        {editing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input 
                id="title"
                type="text" 
                name="title" 
                value={editData.title} 
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea 
                id="description"
                name="description" 
                value={editData.description} 
                onChange={handleChange} 
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700">
                Details
              </label>
              <textarea 
                id="details"
                name="details" 
                value={editData.details} 
                onChange={handleChange} 
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={toggleEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">{order.description}</p>
            <p className="text-gray-500">{order.details}</p>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status}
                </span>
                <button 
                  onClick={toggleEdit}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline"
                >
                  Edit
                </button>
              </div>
              <button 
                onClick={() => onProceed(order.id)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Proceed
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrderCard; 