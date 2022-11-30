import { Awaitable } from "discord.js"
import LuninhaClient from "./LuninhaClient"

export default class Event {

    client: LuninhaClient
	name: string

	constructor(client: LuninhaClient, options = {} as { name: string }) {
		this.name = options.name
		this.client = client
	}


	run(...args: unknown[]): Awaitable<any> {
		return { args }
	}
}