import { EventService, IEvent } from '../../../shared/index';

export function main() {

    describe('Event Service', () => {

        let serviceUnderTest: EventService;

        class MockedEvent implements IEvent {}
        class AnotherMockedEvent implements IEvent {}

        beforeEach(() => {
            serviceUnderTest = new EventService();
        });

        it('should emit and receive after subscribe', () => {
            let notifiedOne = false;
            let notifiedTwo = false;

            serviceUnderTest.subscribe(() => notifiedOne = true, MockedEvent);
            serviceUnderTest.subscribe(() => notifiedTwo = true, AnotherMockedEvent);

            serviceUnderTest.emit(new MockedEvent());
            expect(notifiedOne).toBeTruthy();
            expect(notifiedTwo).toBeFalsy();

            notifiedOne = false;
            notifiedTwo = false;
            serviceUnderTest.emit(new AnotherMockedEvent());
            expect(notifiedTwo).toBeTruthy();
            expect(notifiedOne).toBeFalsy();
        });

        it('should not receive event after unsubscribe', () => {
            let notified = false;

            let sub = serviceUnderTest.subscribe(() => notified = true, MockedEvent);
            serviceUnderTest.emit(new MockedEvent());
            expect(notified).toBeTruthy();

            notified = false;
            sub.unsubscribe();
            serviceUnderTest.emit(new MockedEvent());
            expect(notified).toBeFalsy();
        });

        it('should unsubscribe all on destroy', () => {
            let notified = false;

            serviceUnderTest.subscribe(() => notified = true, MockedEvent);
            serviceUnderTest.emit(new MockedEvent());
            expect(notified).toBeTruthy();

            serviceUnderTest.ngOnDestroy();

            notified = false;
            serviceUnderTest.emit(new MockedEvent());
            expect(notified).toBeFalsy();
        });
    });
}
