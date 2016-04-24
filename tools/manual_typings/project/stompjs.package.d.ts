/**
 * Typescript interface definitions for using
 * Jeff Mesnil's stomp.js Javascript STOMP client
 * under Typescript, for example with Angular 2.
 *
 * https://github.com/jmesnil/stomp-websocket
 *
 */
declare module 'stompjs/lib/stomp' {

	export interface Client {
		heartbeat: any;
    connected: any;
		
		debug(...args: string[]) : void;

		connect(...args: any[]) : void;
		disconnect(disconnectCallback: () => any, headers?: any) : void;

		send(destination: string, headers?:any, body?: string) : void;
		subscribe(destination: string, callback?: (message: Message) => any, body?: string) : Subscription;

		begin(transaction: string) : void;
		commit(transaction: string) : void;
		abort(transaction: string) : void;

		ack(messageID: string, subscription: string, headers?: any) : void;
		nack(messageID: string, subscription: string, headers?: any) : void;
	}
  
  export interface Subscription {
    unsubscribe() : void;
  }

	export interface Message {
		command: string;
		headers: any;
		body: string;

		ack(headers?: any) : void;
		nack(headers?: any) : void;
	}

	export interface Frame {
		constructor(command: string, headers?: any, body?: string) : void;

		toString(): string;
		sizeOfUTF8(s: string) : void;
		unmarshall(datas: any) : void;
		marshall(command: string, headers? : any, body? : any) : void;
	}

	export interface Stomp {
		client: Client;
		Frame: Frame;

		over(ws: WebSocket) : void;
	}

	export var Stomp : any;
}