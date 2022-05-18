import { Awaitable } from "discord.js"
import EclipseClient from "./EclipseClient"

export default class Event {

    client: EclipseClient
	name: string

	constructor(client: EclipseClient, options = {} as { name: string }) {
		this.name = options.name
		this.client = client
	}


	run(...args: unknown[]): Awaitable<any> {
		return { args }
	}
}