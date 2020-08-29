import {Client, ClientOptions, Guild} from 'discord.js'
import handler from './handler'
import guildCreate from '../../listeners/guildCreate'
import {register} from '../guild'

function rotatePresence(client: DosbotClient) : void {
    async function pres1() {
        await client.user?.setPresence({
            activity: {
                name: `다스야 도움 | 샤드 #${client.shard?.ids.reduce((acc,cur) => acc+cur)}`,
                type: 'PLAYING'
            }
        })
        setTimeout(pres2, 10000)
    }

    async function pres2() {
        await client.user?.setPresence({
            activity: {
                name: `서버 수: ${(await client.shard?.fetchClientValues('guilds.cache.size'))?.reduce((acc,cur) => acc+cur)}`,
                type: 'PLAYING'
            }
        })
        setTimeout(pres3, 10000)
    }
    async function pres3() {
        await client.user?.setPresence({
            activity: {
                name: `유저 수: ${(await client.shard?.fetchClientValues('users.cache.size'))?.reduce((acc,cur) => acc+cur)}`,
                type: 'PLAYING'
            }
        })
        setTimeout(pres4, 10000)
    }
    async function pres4() {
        await client.user?.setPresence({
            activity: {
                name: `샤드 서버 수: ${client.guilds.cache.size}`,
                type: 'PLAYING'
            }
        })
        setTimeout(pres5, 10000)
    }
    async function pres5() {
        await client.user?.setPresence({
            activity: {
                name: `샤드 유저 수: ${client.users.cache.size}`,
                type: 'PLAYING'
            }
        })
        setTimeout(pres1, 10000)
    }
    pres1().then(() => console.log('presence rotate started'))
}

export class DosbotClient extends Client {
    constructor(props?: ClientOptions) {
        super(props)

        this.on('ready',async () => {
            if (!this.shard) {
                console.error('Shard only')
                return process.exit(0)
            }
            console.log(`Logged in as ${this.user?.tag}`)
            await this.user?.setPresence({
                activity: {
                    name: '데이터 처리중...',
                    type: 'PLAYING'
                }
            })

            for (const guild of this.guilds.cache.map(r => r)) {
                await register(guild)
            }

            rotatePresence(this)
        })
        
        this.on('guildCreate', guildCreate)

        this.on('message', handler)
    }
}