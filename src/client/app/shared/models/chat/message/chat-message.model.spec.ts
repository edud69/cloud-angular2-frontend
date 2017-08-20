import { ChatMessage } from './chat-message.model';

export function main() {

  class ChatMessageTest extends ChatMessage {}

  describe('ChatMessage Model', () => {
    it('should match the senderUsername', () => {
        let username = 'a-username';
        let chatMsg = new ChatMessageTest(null, username);
        expect(chatMsg.senderUsername).toEqual(username);
    });

    it('should match the message', () => {
        let message = 'a-chat-message';
        let chatMsg = new ChatMessageTest(message, null);
        expect(chatMsg.message).toEqual(message);
    });

    it('should generate an sentTime date', () => {
        let expectedValue = new Date();
        let modelUnderTest = new ChatMessageTest(null, null);
        expect(modelUnderTest.sentTime.getTime() >= expectedValue.getTime() &&
               modelUnderTest.sentTime.getTime() <= new Date().getTime()).toBeTruthy();
    });
  });
}
