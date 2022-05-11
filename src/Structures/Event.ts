import type NFTCordClient from "./NFTCordClient"
import { Awaitable } from "discord.js"

export default class Event {

    client: NFTCordClient
	name: string

	constructor(client: NFTCordClient, options = {} as { name: string }) {
		this.name = options.name
		this.client = client
	}


	async run(...args: any[]): Promise<Awaitable<any>> {
		return { args }
	}
}