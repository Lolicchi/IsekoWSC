import { IsekoWSC } from './mod.ts'
// import { server } from './server.ts'

// server()
// setTimeout(Deno.exit, 10 * 60 * 1000)

const client = new IsekoWSC({
  token: 'OTgwMzUxMjI4MDgzMDQ4NDk4.GnqpFy.JKssZomm1v_lsR5WvYwoUPCNek1-f3QzqZTtGg',
  onReady: () => {
    // client.close()
    client.setPresence({
      activities: [{ name: 'Deno Dev 1.22.1', type: 3 }],
      status: 'online'
    })
    client.joinVoice('914073971815776286', '914073971815776290')
  }
})
