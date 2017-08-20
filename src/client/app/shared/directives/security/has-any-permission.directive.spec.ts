import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';

import { SharedModule } from '../../shared.module';

import { AuthStateService, AuthoritiesService, IPermission } from '../../index';

export function main() {

    describe('HasAnyPermission Directive', () => {

        @Component({
            selector: 'test-cmp',
            template: '<link rel="stylesheet" href="/base/dist/dev/css/indigo-pink.css" />' +
                      '<div *sdHasAnyPermission="\'INDEX_ALL, CHAT_SEND\'"><span>Hello!</span></div>',
        })
        class TestComponent { }

        let mockedAuthStateService : any;
        let mockedAutoritiesService : any;
        let authChanged : (state : any) => void;
        let hasAnyPerms : (perms : IPermission[]) => boolean;
        let unsubCalled : boolean;

        beforeEach(() => {
            unsubCalled = false;
            mockedAuthStateService = { subscribe: (sub: any) => { authChanged = sub; return {unsubscribe: () => unsubCalled = true};}};
            mockedAutoritiesService = { hasAnyPermission: (obj : any) => hasAnyPerms(obj)};

            TestBed.configureTestingModule({
                imports: [SharedModule],
                declarations: [TestComponent],
                providers: [
                    { provide: AuthStateService,  useValue: mockedAuthStateService },
                    { provide: AuthoritiesService,  useValue: mockedAutoritiesService }
                ]
            });
        });

        // make sure ngOnDestroy clears the subscriptions
        afterAll(() => expect(unsubCalled).toBeTruthy());

        it('should not display the nested component when not having any permissions', async(() => {
            TestBed.compileComponents().then(() => {
                let fixture = TestBed.createComponent(TestComponent);
                hasAnyPerms = perms => false;
                fixture.detectChanges();
                let content = fixture.debugElement.children[1];
                expect(content).toBeUndefined();
            });
        }));

        it('should display the nested component when having any permissions', async(() => {
            TestBed.compileComponents().then(() => {
                let fixture = TestBed.createComponent(TestComponent);
                hasAnyPerms = perms => true;
                fixture.detectChanges();
                let content = fixture.debugElement.children[1].nativeElement.innerText;
                expect(content).toBe('Hello!');
            });
        }));

        it('should update the state if auth state changes', async(() => {
            TestBed.compileComponents().then(() => {
                let fixture = TestBed.createComponent(TestComponent);
                hasAnyPerms = perms => false;
                fixture.detectChanges();

                let content = fixture.debugElement.children[1];
                expect(content).toBeUndefined();

                hasAnyPerms = perms => true;
                authChanged(null);
                fixture.detectChanges();

                let val = fixture.debugElement.children[1].nativeElement.innerText;
                expect(val).toBe('Hello!');
            });
        }));

    });
}
