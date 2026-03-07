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
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998] cursor-pointer"
                    />

                    {/* Notification Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 inset-y-0 h-screen w-[400px] max-w-[90vw] bg-white dark:bg-gray-800 shadow-2xl z-[9999] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white flex items-center justify-between shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <FaBell className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Notifications</h3>
                                    <p className="text-[11px] text-blue-100 font-medium">
                                        {unreadCount > 0 ? `You have ${unreadCount} unread` : 'No new notifications'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Mark all read button (if any unread) */}
                        {unreadCount > 0 && (
                            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/10 border-b border-blue-100 dark:border-blue-900/30 flex justify-end">
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <FaCheck size={12} />
                                    Mark all as read
                                </button>
                            </div>
                        )}

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-transparent">
                            {notifications && notifications.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`px-6 py-5 flex gap-4 cursor-pointer hover:bg-white dark:hover:bg-gray-700/50 transition-all relative group shadow-sm hover:shadow-md ${!notification.read_at ? 'bg-blue-50/40 dark:bg-blue-900/10' : ''
                                                }`}
                                        >
                                            {!notification.read_at && (
                                                <div className="absolute left-1.5 top-0 bottom-0 w-1 bg-blue-600 rounded-full my-4" />
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1">
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                                        {notification.data.hotel_name || 'System Notification'}
                                                    </p>
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-snug group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                                                    {notification.data.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 px-6 text-center">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                        <FaInbox size={28} className="opacity-30" />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No notifications yet</h4>
                                    <p className="text-xs">We'll notify you when something important happens.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <button className="w-full py-3 rounded-xl bg-gray-50 dark:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all active:scale-[0.98]">
                                View All Notification History
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationDropdown;
