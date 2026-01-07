import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheck, FaTimes, FaInbox } from 'react-icons/fa';
import { useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../../services/hotelsApi';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = ({ notifications, unreadCount, isOpen, onClose }) => {
    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const navigate = useNavigate();

    const handleNotificationClick = async (notification) => {
        if (!notification.read_at) {
            await markAsRead(notification.id);
        }

        // Navigate based on notification data
        if (notification.data.room_id) {
            // We might want to navigate to hotel details or a specific room
            // Assuming we have a slug or ID path
            navigate(`/hotel/${notification.data.hotel_id || 'details'}`);
        }
        onClose();
    };

    const handleMarkAllRead = async (e) => {
        e.stopPropagation();
        await markAllAsRead();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                >
                    {/* Header */}
                    <div className="px-5 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </h3>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <FaCheck size={10} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications && notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-5 py-4 flex gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors relative ${!notification.read_at ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                                            }`}
                                    >
                                        {!notification.read_at && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                        )}

                                        {notification.data.image && (
                                            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                                <img
                                                    src={notification.data.image}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight mb-1">
                                                {notification.data.hotel_name}
                                            </p>
                                            <p className="text-[12px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                                                {notification.data.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                <FaInbox size={40} className="mb-3 opacity-20" />
                                <p className="text-sm font-medium">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
                        <button className="w-full text-center text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            View all notification history
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
