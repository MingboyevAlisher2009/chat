import { useAppStore } from "@/store";
import { useMemo, useEffect } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts = [], isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessages,
    selectedChatMessages,
    onlineUsers,
    notification,
    setNotification,
  } = useAppStore();

  const handleSelectChat = (contact) => {
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  useEffect(() => {
    if (!contacts || contacts.length === 0) return;

    const notificationMap = [];

    contacts.forEach((contact) => {
      if (
        contact.messages &&
        Array.isArray(contact.messages) &&
        contact.lastMessageType === "text"
      ) {
        const unseenMessages = contact.messages.filter(
          (item) => item && !item.seen
        );
        if (unseenMessages.length > 0) {
          unseenMessages.forEach((item) => {
            notificationMap.push({
              type: item.messageType,
              sender: item.sender,
              recipient: item.recipient,
              content: item.content,
            });
          });
        }
      }
    });

    setNotification(notificationMap);
  }, [contacts, selectedChatMessages, setNotification]);

  const notificationCounts = useMemo(() => {
    const counts = {};

    if (
      !contacts ||
      contacts.length === 0 ||
      !notification ||
      notification.length === 0
    ) {
      return counts;
    }

    contacts.forEach((contact) => {
      counts[contact._id] = notification.filter(
        (notif) => notif.sender === contact._id
      ).length;
    });

    return counts;
  }, [contacts, notification]);

  const renderLastMessage = (contact) => {
    if (!contact.lastMessageType) return null;

    return contact.lastMessageType === "text" ? (
      contact.lastMessageContent
    ) : (
      <span>Send file</span>
    );
  };

  if (!contacts || contacts.length === 0) {
    return (
      <div className="mt-5 text-center text-neutral-500">
        No contacts available
      </div>
    );
  }

  return (
    <div className="mt-5">
      {contacts.map((contact) => {
        const isSelected = selectedChatData?._id === contact._id;
        const isOnline =
          onlineUsers && onlineUsers.includes(contact._id.toString());
        const notificationCount = notificationCounts[contact._id] || 0;
        const hasNotification = notificationCount > 0;

        const displayName = isChannel
          ? contact.name
          : contact.firstName
          ? `${contact.firstName} ${contact.lastName || ""}`.trim()
          : contact.email;

        return (
          <div
            onClick={() => handleSelectChat(contact)}
            key={contact._id}
            className={`pl-10 py-2 transition-all duration-300 cursor-pointer relative ${
              isSelected
                ? "bg-[#8417ff] hover:bg-[#8417ff]/50 group/user"
                : "hover:bg-[#f1f1f111]"
            }`}
          >
            {hasNotification && (
              <div
                className={`absolute ${
                  selectedChatData ? "hidden md:flex" : "flex"
                } 
                w-5 h-5 rounded-full z-50 right-3 top-6 bg-blue-500 
                transition-all items-center justify-center`}
              >
                <span className="text-xs text-white">{notificationCount}</span>
              </div>
            )}

            <div className="flex gap-5 items-center relative justify-start text-neutral-500">
              {!isChannel ? (
                <div className="relative">
                  {isOnline && (
                    <div
                      className={`absolute ${
                        isSelected
                          ? "hidden md:block border-[#8417ff]"
                          : "border-[#1b1c24]"
                      } w-3 h-3 rounded-full z-10 -bottom-0 -right-0 border-2 bg-[#06d6ae] transition-all`}
                    />
                  )}

                  <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                    {contact.image ? (
                      <AvatarImage
                        src={`${HOST}/${contact.image}`}
                        alt={displayName || "Contact"}
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`${
                          isSelected
                            ? "bg-[#ffffff22] border-2 border-white/70"
                            : getColor(contact.color)
                        } uppercase w-12 h-12 text-lg border-[1px] flex items-center justify-center rounded-full`}
                      >
                        {contact.firstName?.[0] ||
                          (contact.email && contact.email[0]) ||
                          "#"}
                      </div>
                    )}
                  </Avatar>
                </div>
              ) : (
                <div className="bg-[#ffffff22] h-10 w-10 rounded-full flex items-center justify-center">
                  #
                </div>
              )}

              <div className="w-44 h-auto truncate flex flex-col">
                <span className="font-bold truncate">{displayName}</span>
                <div className="truncate">{renderLastMessage(contact)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
