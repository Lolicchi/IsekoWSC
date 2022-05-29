import { IsekoWSC } from './mod.ts'
// import { server } from './server.ts'

// server()
// setTimeout(Deno.exit, 10 * 60 * 1000)

const client = new IsekoWSC({
  token: 'OTU3MTYyODA0NjE4NjAwNTE5.GqM9Ui.07qW2OdPy9YAO6OEr9WEo3YEx1wyIofs-JOPvY',
  onReady: () => {
    // client.close()
    client.setPresence({
      activities: [{ name: 'Deno Dev 1.22.1', type: 2 }],
      status: 'online'
    })
    client.joinVoice('914073971815776286', '914073971815776290')
  }
})
