import type * as Party from "partykit/server";

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  onConnect(
    connection: Party.Connection<unknown>,
    ctx: Party.ConnectionContext,
  ): void | Promise<void> {}
  onMessage(message: string, sender: Party.Connection) {
    for (const conn of this.room.getConnections()) {
      if (conn.id !== sender.id) {
        conn.send(message);
      }
    }
  }
}
