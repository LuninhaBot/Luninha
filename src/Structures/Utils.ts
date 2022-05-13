import { parse } from "path"
import { promisify } from "util"
import pkg from "glob"

import Command from "./Command"
import Event from "./Event"

import type NFTCordClient from "./NFTCordClient"
import { GuildMember } from "discord.js"
import Logger from "../Utils/Logger"

const glob = promisify(pkg)

export default class Util {

	client: NFTCordClient

	constructor(client: NFTCordClient) {
		this.client = client
	}

	isClass(input: Function | object): boolean {
		return (
			typeof input === "function" &&
			typeof input.prototype === "object" &&
			input.toString().substring(0, 5) === "class"
		)
	}

	formatPerms(perms: string) {
		return perms.replace("_", " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
	}

	trimArray(arr: any[], maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen
			arr = arr.slice(0, maxLen)
			arr.push(`${len} mais...`)
		}
		return arr
	}

	formatBytes(bytes: number) {
		if (bytes === 0) return "0 Bytes"
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
		const i = Math.floor(Math.log(bytes) / Math.log(1024))
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
	}

	removeDuplicates(arr: any[]) {
		return [...new Set(arr)]
	}

	capitalize(string: string) {
		return string
			.split(" ")
			.map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
			.join(" ")
	}

	checkOwner(target: string) {
		return this.client.owners.includes(target)
	}

	comparePerms(member: GuildMember, target: GuildMember) {
		return member.roles.highest.position < target.roles.highest.position
	}

	async fetchOwners(ids: string[]) {
		let owners = []
		for (const id of ids) {
			let user = await this.client.users.fetch(id)
			owners.push(user ? `**${user.username}**#${user.discriminator}` : "unknown")
		}

		return owners.join(", ")
	}

	formatDate(date: Date): string {
		return date.toLocaleString("pt-BR", {
			timeZone: "America/Sao_Paulo",
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
	}

	formatTime(time: number) {
		time = Math.round(time / 1000)
		const s = time % 60,
			m = Math.floor((time / 60) % 60),
			h = Math.floor(time / 60 / 60)

		return h
			? `${String(h).length === 2 ? h : `0${h}`}:${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`
			: `${String(m).length === 2 ? m : `0${m}`}:${String(s).length === 2 ? s : `0${s}`}`;
	}

	time(s: number) {
		function pad(n: number, z?: number) {
			z = z || 2
			return ('00' + n).slice(-z)
		}
		let ms = s % 1000
		s = (s - ms) / 1000
		let secs = s % 60
		s = (s - secs) / 60
		let mins = s % 60
		let hrs = (s - mins) / 60
	
		let days = Number(Math.floor(hrs / 24))
		hrs = Number(hrs % 24)
		
		let meses = Number(Math.floor(days / 30))
		days = Number(days % 30)
		
		return (meses > 0 ? pad(meses) + 'm, ' : "") + (days > 0 ? pad(days) + 'd, ' : "") + (hrs > 0 ? pad(hrs) + 'h, ' : "") + (mins > 0 ? pad(mins) + 'm ' : "") + (pad(secs) + 's')
	}


	async loadCommands() {

		const commands = await glob(`./build/Commands/**/*.js`, { absolute: true })

		Logger.log(`Loading a total of ${commands.length} commands`, "log")

		for (const commandFile of commands) {

			const { name } = parse(commandFile)
			try {

				const rawFile = await import(commandFile)
				const File = rawFile.default
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn"t export a class.`)

				const command = new File(this.client, name.toLowerCase())
				if (!(command instanceof Command)) throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`)
				Logger.log(`Loading Command: ${name}`, "log")
				this.client.commands.set(command.name, command)

			} catch (e) {
				Logger.log(`Unable to load command ${name}: ${e}`, "error")
			}
		}
	}

	async loadEvents() {

		const events = await glob(`./build/Events/**/*.js`, { absolute: true })

		Logger.log(`Loading a total of ${events.length} events`, "log")
		for (const eventFile of events) {

			const { name } = parse(eventFile)
			try {

				const rawFile = await import(eventFile)
				const File = rawFile.default
				if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn"t export a class.`)

				const event = new File(this.client, name.toLowerCase())
				if (!(event instanceof Event)) throw new TypeError(`Comamnd ${name} doesnt belong in Commands.`)
				this.client.events.set(event.name, event)
				this.client.on(event.name, (...rest: any[]) => event.run(...rest))
				Logger.log(`Loading Event: ${name}`)

			} catch (e) {
				Logger.error(`Unable to load event ${name}: ${e}`)
			}
		}
	}
}