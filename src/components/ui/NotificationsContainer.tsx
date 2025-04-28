import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { removeNotification } from '../../store/slices/uiSlice';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import '../../assets/styles/components/ui/NotificationsContainer.scss';

const NotificationsContainer: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.ui);
  const [visibleNotifications, setVisibleNotifications] = useState<string[]>([]);
  
  useEffect(() => {
    // Ajouter les nouvelles notifications à la liste des visibles
    const newIds = notifications
      .filter(n => !visibleNotifications.includes(n.id))
      .map(n => n.id);
    
    if (newIds.length > 0) {
      setVisibleNotifications(prev => [...prev, ...newIds]);
    }
  }, [notifications, visibleNotifications]);
  
  useEffect(() => {
    // Configurer les auto-fermetures pour les notifications
    const autoCloseNotifications = notifications.filter(n => n.autoClose);
    
    autoCloseNotifications.forEach(notification => {
      const timer = setTimeout(() => {
        handleClose(notification.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [notifications]);
  
  const handleClose = (id: string) => {
    // Animer la fermeture de la notification
    setVisibleNotifications(prev => prev.filter(notifId => notifId !== id));
    
    // Supprimer la notification après l'animation
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, 300); // Durée de l'animation en ms
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle />;
      case 'error':
        return <FaExclamationTriangle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
      default:
        return <FaInfoCircle />;
    }
  };
  
  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`notification ${notification.type} ${visibleNotifications.includes(notification.id) ? 'show' : ''}`}
        >
          <div className="notification-icon">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="notification-content">
            <p>{notification.message}</p>
          </div>
          
          <button 
            className="notification-close"
            onClick={() => handleClose(notification.id)}
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationsContainer;
