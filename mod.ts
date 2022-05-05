console.log('hoi')
export class IsekoWSC extends WebSocket {
  // heartbeatInterval!: number
  // sessionId!: string
  // sequence!: number
  heartbeat: (ms: number) => void
  identify: (token?: string, intents?: string[] | number) => void
  setPresence: (activity: {
    since?: number | null //
    activities: {
      name: string
      type: 0 | 1 | 2 | 3 | 4 | 5
      url?: string | null
      createdAt?: number //
      timestamps?: {
        start?: number
        end?: number
      }
      applicationId?: string // snowflake
      details?: string | null
      state?: string | null
      emoji?: {} | null
      party?: {
        id?: string
        size?: [number, number]
      }
      assets?: {
        largeImageId?: string
        largeImageText?: string
        smallImageId?: string
        smallImageText?: string
      }
      secrets?: {
        join: string
        spectate: string
        match: string
      }
      instance?: boolean
      flags?:
        | number
        | 'INSTANCE'
        | 'JOIN'
        | 'SPECTATE'
        | 'JOIN_REQUEST'
        | 'SYNC'
        | 'PLAY'
        | 'PARTY_PRIVACY_FRIENDS'
        | 'PARTY_PRIVACY_VOICE_CHANNEL'
        | 'EMBEDDED'
      buttons?: {
        label: string
        url: string
      }[]
    }[]
    status: 'online' | 'dnd' | 'idle' | 'invisible' | 'offline' //
    afk?: boolean //
  }) => void
  joinVoice: (guildId: string, channelId: string) => void

  constructor(wscOptions: { token: string; onReady?: () => void }) {
    super('wss://gateway.discord.gg/?v=9&encoding=json')

    this.onopen = () => {
      console.log('Connected to gateway.')
    }

    this.onmessage = rawData => {
      const payload: {
        t: string
        s: number
        op: number
        d: any
      } = JSON.parse(rawData.data.toString())

      switch (payload.op) {
        case 10: // hello
          console.log(
            `HELLO payload recieved, heartbeat_interval: ${payload.d.heartbeat_interval} ms.`
          )
          this.heartbeat(payload.d.heartbeat_interval)
          this.identify()
          break
        case 0: // dispatch event
          console.log(payload.t)
          console.log(payload.s)
          switch (payload.t) {
            case 'READY':
              console.log('Ready.', payload.d.session_id)
              if (!wscOptions.onReady) return
              wscOptions.onReady()
              break
          }
          break
      }
    }

    this.onerror = err => {
      console.log('Err ::', err)
      Deno.exit()
    }

    this.onclose = code => {
      console.log('Closed ::', code)
      Deno.exit()
    }

    this.identify = (token = wscOptions.token, intents = 0) => {
      const i = () => {
        this.send(
          JSON.stringify({
            op: 2,
            d: {
              token: token,
              intents: intents,
              properties: {
                $os: 'linux',
                $browser: 'Discord iOS',
                $device: 'discord.js'
              }
            }
          })
        )
      }

      if (this.readyState == 1) return i()
      this.addEventListener('open', () => {
        i()
      })
    }

    this.heartbeat = (ms: number) => {
      // this.heartbeatInterval = ms
      console.log(`Sending heartbeat, heartbeat_interval: ${ms} ms.`)
      setInterval(() => {
        this.send(JSON.stringify({ op: 1, d: null }))
      }, ms)
    }

    this.setPresence = activity => {
      const d = {
            activities: activity.activities.map(a => ({
              name: a.name,
              type: a.type,
              url: a.url,
              details: a.details,
              state: a.state,
              application_id: a.applicationId,
              party: a.party,
              timestamps: a.timestamps,
              assets: {
                large_image: a.assets?.largeImageId,
                large_text: a.assets?.largeImageText,
                small_image: a.assets?.smallImageId,
                small_text: a.assets?.smallImageText
              },
              buttons: a.buttons,
              created_at: a.createdAt || Date.now()
            })),
            since: Date.now(),
            status: activity.status,
            afk: false
          }
      console.log(d)
      this.send(
        JSON.stringify({
          op: 3, // presence update
          d: d
        })
      )
    }

    this.joinVoice = (guildId, channelId) => {
      this.send(
        JSON.stringify({
          op: 4, // voice state update
          d: {
            guild_id: guildId,
            channel_id: channelId,
            self_mute: false,
            self_deaf: false
          }
        })
      )
      console.log('Successfully joined voicechannel.')
    }
  }
}
