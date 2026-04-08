package com.authentick.service;

import com.authentick.model.Notification;
import com.authentick.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public Notification create(Long userId, Notification.NotificationType type,
                                String title, String message,
                                Long relatedEntityId, String relatedEntityType) {
        Notification n = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .isRead(false)
                .build();
        n = notificationRepository.save(n);

        // Push real-time update via WebSocket
        long unread = notificationRepository.countByUserIdAndIsReadFalse(userId);
        messagingTemplate.convertAndSend("/topic/notifications/" + userId,
                Map.of(
                    "type", "NEW_NOTIFICATION",
                    "notification", Map.of(
                        "id", n.getId(),
                        "type", n.getType().name(),
                        "title", n.getTitle(),
                        "message", n.getMessage(),
                        "createdAt", n.getCreatedAt().toString()
                    ),
                    "unreadCount", unread
                ));

        return n;
    }

    public void pushDashboardEvent(Long userId, String eventType, Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/dashboard/" + userId,
                Map.of("type", eventType, "data", payload));
    }
}
