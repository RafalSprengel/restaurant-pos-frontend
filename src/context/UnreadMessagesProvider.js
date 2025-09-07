import { createContext, useContext } from 'react';
import { useFetch } from '../hooks/useFetch';

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
    const { data, refetch: refetchUnreadCount } = useFetch('/messages/unread-count', 0)
    return (
        <UnreadMessagesContext.Provider value={{
            unreadMessageCount: data?.count || 0,
            refetchUnreadCount
        }}
        >
            {children}
        </UnreadMessagesContext.Provider>

    )
};

export const useUnreadMessages = () => useContext(UnreadMessagesContext);
