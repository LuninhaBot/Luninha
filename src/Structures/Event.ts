import EclipseClient from "./EclipseClient"

export default class Event {

    client: EclipseClient
	name: string

	constructor(client: EclipseClient, options = {} as { name: string }) {
		this.name = options.name
		this.client = client
	}


	async run(...args: any[]): Promise<any> {
		return { args }
	}
}