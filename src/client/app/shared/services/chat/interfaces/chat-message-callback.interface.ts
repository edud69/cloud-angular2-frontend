import { ChatMessage, TypingAction, ParticipantJoinEvent, ParticipantLeaveEvent } from '../../../index';

export interface IChatMessageCallback {
  onMessageReceive(message : ChatMessage) : void;
  onTypingActionReceive(typingAction : TypingAction) : void;
  onParticipantJoin(participantJoinEvent : ParticipantJoinEvent) : void;
  onParticipantLeave(participantLeaveEvent : ParticipantLeaveEvent) : void;
}
